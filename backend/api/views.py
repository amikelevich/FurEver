from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import AdoptionApplicationSerializer, RegisterSerializer, LoginSerializer, AnimalSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdoptionApplication, Animal, AnimalImage
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

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