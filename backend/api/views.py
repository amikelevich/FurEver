from rest_framework import generics
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.hashers import check_password

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        print("Utworzono użytkownika:", user.email)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        # używamy naszego LoginSerializer z check_password
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # jeśli nie valid, DRF zwróci 400
        user = serializer.validated_data['user']

        # generujemy tokeny JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })