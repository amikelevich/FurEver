from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionApplicationViewSet, CurrentUserView, LoginView, RegisterView, AnimalViewSet

router = DefaultRouter()
router.register(r'animals', AnimalViewSet)
router.register(r'adoption-applications', AdoptionApplicationViewSet, basename='adoption-application')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path("", include(router.urls)),
]
