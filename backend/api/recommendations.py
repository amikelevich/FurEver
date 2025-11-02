import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from django.core.cache import cache
from .models import Animal, Interaction
from django.conf import settings
from django.db import models

FEATURE_WEIGHTS = {
    'species': 2.0,
    'age': 1.0,
    'gender': 1.0,
    'short_traits': 3.0,
    'human_friendly': 1.5,
    'animal_friendly': 1.5,
    'best_home': 1.0,
    'flags': 0.5
}

def get_pet_vectors_dataframe():
    cached_df = cache.get('all_pet_vectors_df')
    if cached_df is not None:
        return cached_df

    animals = Animal.objects.all().prefetch_related('liked_by')
    if not animals.exists():
        return pd.DataFrame()

    data = []
    for pet in animals:
        pet_data = {
            'id': pet.id,
            'species': pet.species,
            'age': pet.age,
            'gender': pet.gender,
            'short_traits': pet.short_traits,
            'human_friendly': pet.human_friendly,
            'animal_friendly': pet.animal_friendly,
            'best_home': pet.best_home,
            'sterilized': int(pet.sterilized),
            'vaccinated': int(pet.vaccinated),
            'dewormed': int(pet.dewormed),
            'chipped': int(pet.chipped),
        }
        data.append(pet_data)
        
    df = pd.DataFrame(data).set_index('id')

    categorical_features = ['species', 'gender', 'human_friendly', 'animal_friendly', 'best_home']
    df_categorical = pd.get_dummies(df[categorical_features], columns=categorical_features, drop_first=True)
    
    for col in df_categorical.columns:
        if col.startswith('species_'):
            df_categorical[col] *= FEATURE_WEIGHTS['species']
        elif col.startswith('gender_'):
            df_categorical[col] *= FEATURE_WEIGHTS['gender']
        elif col.startswith('human_friendly_'):
            df_categorical[col] *= FEATURE_WEIGHTS['human_friendly']
        elif col.startswith('animal_friendly_'):
            df_categorical[col] *= FEATURE_WEIGHTS['animal_friendly']
        elif col.startswith('best_home_'):
            df_categorical[col] *= FEATURE_WEIGHTS['best_home']
            
    scaler = MinMaxScaler()
    df_numerical = pd.DataFrame(
        scaler.fit_transform(df[['age']]), 
        columns=['age'], 
        index=df.index
    )
    df_numerical['age'] *= FEATURE_WEIGHTS['age']

    flag_features = ['sterilized', 'vaccinated', 'dewormed', 'chipped']
    df_flags = df[flag_features] * FEATURE_WEIGHTS['flags']

    mlb = MultiLabelBinarizer()
    traits_df = pd.DataFrame(
        mlb.fit_transform(df['short_traits']),
        columns=mlb.classes_,
        index=df.index
    )
    traits_df *= FEATURE_WEIGHTS['short_traits']

    final_df = pd.concat([df_categorical, df_numerical, df_flags, traits_df], axis=1)
    
    cache.set('all_pet_vectors_df', final_df, timeout=3600)
    
    return final_df


def get_user_profile_vector(user, all_pet_vectors):

    liked_pets_ids = list(user.liked_animals.all().values_list('id', flat=True))
    
    viewed_pets_ids = list(Interaction.objects.filter(user=user, interaction_type='VIEW')
                           .values_list('animal_id', flat=True))

    if not liked_pets_ids and not viewed_pets_ids:
        return None

    all_interactions_data = []
    
    interaction_weight_favorite = 5.0 
    for pet_id in liked_pets_ids:
        if pet_id in all_pet_vectors.index:
            all_interactions_data.append({'id': pet_id, 'weight': interaction_weight_favorite})

    interaction_weight_view = 1.0
    for pet_id in viewed_pets_ids:
        if pet_id in all_pet_vectors.index and pet_id not in liked_pets_ids:
            all_interactions_data.append({'id': pet_id, 'weight': interaction_weight_view})

    if not all_interactions_data:
        return None

    interactions_df = pd.DataFrame(all_interactions_data).set_index('id')
    interactions_df = interactions_df.groupby(level=0).max() 

    user_pet_vectors = all_pet_vectors.loc[all_pet_vectors.index.isin(interactions_df.index)]
    
    ordered_weights = interactions_df.loc[user_pet_vectors.index]['weight'].values
    
    user_profile_vector = np.average(user_pet_vectors, axis=0, weights=ordered_weights)
    
    return user_profile_vector.reshape(1, -1)


def get_content_based_recommendations(user, top_n=10):

    all_pet_vectors = get_pet_vectors_dataframe()
    
    if all_pet_vectors.empty:
        return Animal.objects.none()

    user_profile = get_user_profile_vector(user, all_pet_vectors)
    
    if user_profile is None:
        return Animal.objects.filter(adoption_date__isnull=True).order_by('-created_at')[:top_n]

    interacted_pet_ids = list(user.liked_animals.all().values_list('id', flat=True)) + \
                         list(Interaction.objects.filter(user=user).values_list('animal_id', flat=True))
    
    adopted_pet_ids = list(Animal.objects.filter(adoption_date__isnull=False).values_list('id', flat=True))
    
    all_ids_to_exclude = list(set(interacted_pet_ids + adopted_pet_ids))

    pets_to_recommend_vectors = all_pet_vectors.drop(all_ids_to_exclude, errors='ignore')

    if pets_to_recommend_vectors.empty:
        return Animal.objects.none()
    
    similarity_scores = cosine_similarity(user_profile, pets_to_recommend_vectors)
    \
    scores_series = pd.Series(similarity_scores[0], index=pets_to_recommend_vectors.index)
    top_pet_ids = scores_series.nlargest(top_n).index
    
    recommended_pets = Animal.objects.filter(id__in=top_pet_ids)
    
    preserved_order = models.Case(*[models.When(id=id_val, then=pos) for pos, id_val in enumerate(top_pet_ids)])
    return recommended_pets.order_by(preserved_order)