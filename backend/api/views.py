from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import AdoptionApplicationSerializer, RegisterSerializer, LoginSerializer, AnimalSerializer, InteractionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdoptionApplication, Animal, AnimalImage, Interaction
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import json
from django.core.cache import cache
from .recommendations import get_content_based_recommendations
from django.db import models
from django.db.models import Count
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator


User = get_user_model()

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def send_question_email(request):
    data = request.data
    subject = f"Pytanie od {data.get('first_name')} {data.get('last_name')}"
    message = f"""
    Imię: {data.get('first_name')}
    Nazwisko: {data.get('last_name')}
    Email: {data.get('email')}
    Telefon: {data.get('phone')}
    
    Pytanie:
    {data.get('question')}
    """
    recipient = ['adresdocelowy@przyklad.com']

    try:
        send_mail(subject, message, 'twójemail@przyklad.com', recipient)
        return Response({'success': 'Email wysłany!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        print("Utworzono użytkownika:", user.email)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_superuser": user.is_superuser
            }
        })
    
class LogInteractionView(generics.CreateAPIView):
    serializer_class = InteractionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
    
class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        animal = self.perform_create(serializer)

        images = request.FILES.getlist("images")
        for img in images:
            AnimalImage.objects.create(animal=animal, image_data=img.read())

        response_serializer = self.get_serializer(animal)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', True) 
        instance = self.get_object() 
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        animal = self.perform_update(serializer)

        images = request.FILES.getlist("images")
        for img in images:
            AnimalImage.objects.create(animal=animal, image_data=img.read())

        images_to_delete_str = request.data.get("images_to_delete")
        if images_to_delete_str:
            try:
                image_ids = json.loads(images_to_delete_str)
                if isinstance(image_ids, list):
                    AnimalImage.objects.filter(
                        id__in=image_ids,
                        animal=animal 
                    ).delete()
            except json.JSONDecodeError:
                pass 

        response_serializer = self.get_serializer(animal)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def admin_approve(self, request, pk=None):
        try:
            animal = self.get_object()
            if animal.adoption_date:
                return Response({"error": "Zwierzę już adoptowane"}, status=status.HTTP_400_BAD_REQUEST)

            animal.adoption_date = timezone.now().date()
            animal.save()
            
            response_serializer = self.get_serializer(animal)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        animal = self.get_object()
        animal.liked_by.add(request.user)
        return Response({"message": "Dodano do ulubionych"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def unlike(self, request, pk=None):
        animal = self.get_object()
        animal.liked_by.remove(request.user)
        return Response({"message": "Usunięto z ulubionych"}, status=status.HTTP_200_OK)
    
    def get_serializer_context(self):
        return {"request": self.request}
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if self.request.query_params.get("favorites") and user.is_authenticated:
            queryset = queryset.filter(liked_by=user)

        species = self.request.query_params.get("species")
        if species:
            queryset = queryset.filter(species=species)

        age = self.request.query_params.get("age")
        if age == "young":
            queryset = queryset.filter(age__lt=2)
        elif age == "adult":
            queryset = queryset.filter(age__gte=2, age__lte=7)
        elif age == "senior":
            queryset = queryset.filter(age__gt=7)

        gender = self.request.query_params.get("gender")
        if gender:
            queryset = queryset.filter(gender=gender)

        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location=location)

        short_trait = self.request.query_params.get("short_trait")
        if short_trait:
            queryset = queryset.filter(short_traits__contains=[short_trait])

        breed = self.request.query_params.get("breed")
        if breed:
            queryset = queryset.filter(breed=breed)

        return queryset
    @action(detail=False, methods=["get"])
    def public_random(self, request):
        available_animals = Animal.objects.filter(adoption_date__isnull=True)
        random_animals = available_animals.order_by('?')
        three_random_animals = random_animals[:3]
        serializer = AnimalSerializer(
            three_random_animals, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("query", "").strip()
        if not query:
            return Response({"error": "Brak frazy do wyszukania"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset().filter(name__icontains=query)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        animal = serializer.save()
        images = self.request.FILES.getlist("images")
        for img in images:
            AnimalImage.objects.create(animal=animal, image_data=img.read())
        
        cache.delete('all_pet_vectors_df')
        return animal

    def perform_update(self, serializer):
        animal = serializer.save()
        images = self.request.FILES.getlist("images")
        for img in images:
            AnimalImage.objects.create(animal=animal, image_data=img.read())
        
        images_to_delete_str = self.request.data.get("images_to_delete")
        if images_to_delete_str:
             try:
                image_ids = json.loads(images_to_delete_str)
                if isinstance(image_ids, list):
                    AnimalImage.objects.filter(
                        id__in=image_ids,
                        animal=animal 
                    ).delete()
             except json.JSONDecodeError:
                pass 
        
        cache.delete('all_pet_vectors_df')
        return animal

class RecommendationView(APIView):
    """
    Zwraca spersonalizowane rekomendacje "Dla Ciebie" 
    dla zalogowanego użytkownika.
    """
    permission_classes = [IsAuthenticated]

    @method_decorator(never_cache)
    def get(self, request):
        user = request.user
        
        recommended_pets = get_content_based_recommendations(user, top_n=12)
        
        serializer_context = {'request': request}
        serializer = AnimalSerializer(recommended_pets, many=True, context=serializer_context)
        
        return Response(serializer.data)

    def get(self, request):
        user = request.user
        
        recommended_pets = get_content_based_recommendations(user, top_n=12)
        
        serializer_context = {'request': request}
        serializer = AnimalSerializer(recommended_pets, many=True, context=serializer_context)
        
        return Response(serializer.data)
    
class AnimalViewCountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        animal_ids = request.data.get('animal_ids', [])
        if not animal_ids:
            return Response({})

        user = request.user

        view_counts = Interaction.objects.filter(
            user=user,
            animal_id__in=animal_ids,
            interaction_type='VIEW'
        ).values('animal_id') \
         .annotate(view_count=Count('id'))

        counts_dict = {item['animal_id']: item['view_count'] for item in view_counts}
        
        return Response(counts_dict)

class AdoptionApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = AdoptionApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return AdoptionApplication.objects.all().order_by("-submitted_at")
        return AdoptionApplication.objects.filter(user=user).order_by("-submitted_at")

    def perform_create(self, serializer):
        print("request.user:", self.request.user, type(self.request.user))
        serializer.save(user=self.request.user)


    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            permission_classes = [IsAuthenticated]
        elif self.action in ["public_last_adoptions", "public"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        application = self.get_object()
        if application.decision != "pending":
            return Response({"error": "Wniosek już został rozpatrzony"}, status=status.HTTP_400_BAD_REQUEST)
        
        application.decision = "approved"
        application.adoption_date = timezone.now()
        application.save()
        
        return Response({"success": "Wniosek zatwierdzony"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def public_last_adoptions(self, request):
        last_apps = AdoptionApplication.objects.filter(decision="approved").order_by("-adoption_date")[:10]
        serializer = self.get_serializer(last_apps, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def public(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class MyAdoptionsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AdoptionApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdoptionApplication.objects.filter(user=self.request.user).order_by("-submitted_at")