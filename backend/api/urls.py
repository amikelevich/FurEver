from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionApplicationViewSet, AnimalViewCountView, CurrentUserView, LoginView, MyAdoptionsViewSet, RegisterView, AnimalViewSet, send_question_email, LogInteractionView, RecommendationView

router = DefaultRouter()
router.register(r'animals', AnimalViewSet)
router.register(r'adoption-applications', AdoptionApplicationViewSet, basename='adoption-application')
router.register(r'my-adoptions', MyAdoptionsViewSet, basename='my-adoptions')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('send-question-email/', send_question_email, name='send-question-email'),
    path('log-interaction/', LogInteractionView.as_view(), name='log-interaction'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('interactions/view-counts/', AnimalViewCountView.as_view(), name='animal-view-counts'),
    path("", include(router.urls)),
]
