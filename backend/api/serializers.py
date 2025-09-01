import base64
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Animal, AnimalImage

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Niepoprawny email lub hasło")

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Niepoprawny email lub hasło")

        data['user'] = user
        return data
    
class AnimalImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = AnimalImage
        fields = ["id", "image"]

    def get_image(self, obj):
        if obj.image_data:
            return "data:image/jpeg;base64," + base64.b64encode(obj.image_data).decode()
        return None


class AnimalSerializer(serializers.ModelSerializer):
    images = AnimalImageSerializer(many=True, read_only=True)
    short_traits_display = serializers.SerializerMethodField()

    class Meta:
        model = Animal
        fields = [
            'id', 'name', 'short_traits', 'short_traits_display', 'description',
            'gender', 'age', 'breed', 'location',
            'human_friendly', 'animal_friendly', 'best_home',
            'sterilized', 'vaccinated', 'dewormed', 'chipped',
            'health_status', 'examinations', 'last_vet_visit', 'adoption_date',
            'images'
        ]

    def validate_short_traits(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("short_traits musi być listą")
        return value
    
    def get_short_traits_display(self, obj):
        trait_map = dict(obj.SHORT_TRAITS_CHOICES)
        return [trait_map.get(trait, trait) for trait in obj.short_traits]