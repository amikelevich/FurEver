from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import AdoptionApplicationSerializer, RegisterSerializer, LoginSerializer, AnimalSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdoptionApplication, Animal, AnimalImage
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from django.utils import timezone


User = get_user_model()

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
    
class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        animal = serializer.save()

        images = request.FILES.getlist("images")
        for img in images:
            AnimalImage.objects.create(animal=animal, image_data=img.read())

        response_serializer = self.get_serializer(animal)
        return Response(response_serializer.data, status=201)
    
    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def admin_approve(self, request, pk=None):
        try:
            animal = self.get_object()
            if animal.adoption_date:
                return Response({"error": "Zwierzę już adoptowane"}, status=status.HTTP_400_BAD_REQUEST)

            animal.adoption_date = timezone.now().date()
            animal.save()

            return Response({"message": "Adopcja zatwierdzona przez admina"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        try:
            app = self.get_object()
            animal = app.animal

            app.decision = "approved"
            app.adoption_date = timezone.now().date()
            app.save()

            animal.adoption_date = app.adoption_date
            animal.save()

            return Response(
                {"message": "Wniosek zatwierdzony", "application": AdoptionApplicationSerializer(app).data},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class MyAdoptionsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AdoptionApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdoptionApplication.objects.filter(user=self.request.user).order_by("-submitted_at")