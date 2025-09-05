from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.models import BaseUserManager
from backend import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    objects = CustomUserManager()

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return self.email

class Animal(models.Model):
    name = models.CharField("Imię", max_length=100)
    
    SHORT_TRAITS_CHOICES = [
        ("calm", "Spokojny"),
        ("afraid_of_loud_sounds", "Boi się głośnych dźwięków"),
        ("active", "Aktywny"),
        ("likes_company", "Lubi towarzystwo"),
        ("independent", "Niezależne"),
    ]
    short_traits = models.JSONField("Krótka charakterystyka", default=list, blank=True)

    description = models.TextField("Opis", blank=True, null=True)

    GENDER_CHOICES = [
        ("male", "Samiec"),
        ("female", "Samica"),
        ("unknown", "Nieznany")
    ]
    gender = models.CharField("Płeć", max_length=10, choices=GENDER_CHOICES, default="unknown")

    age = models.PositiveIntegerField("Wiek (lata)")
    breed = models.CharField("Rasa", max_length=100, blank=True, null=True)

    LOCATION_CHOICES = [
        ("shelter-Warsaw-Warszawska-15", "Schronisko w Warszawie"),
        ("shelter-Krakow-Warszawska-15", "Schronisko w Krakowie"),
        ("shelter-Poznan-Warszawska-15", "Schronisko w Poznaniu"),
        ("foster-home", "Dom tymczasowy"),
    ]
    location = models.CharField(
        "Lokalizacja", max_length=50, choices=LOCATION_CHOICES, blank=True, null=True
    )

    HUMAN_FRIENDLY_CHOICES = [
        ("friendly", "Przyjazny"),
        ("neutral", "Neutralny"),
        ("fearful", "Boi się ludzi")
    ]
    human_friendly = models.CharField(
        "Stosunek do ludzi", max_length=20, choices=HUMAN_FRIENDLY_CHOICES, blank=True, null=True
    )

    ANIMAL_FRIENDLY_CHOICES = [
        ("friendly", "Przyjazny"),
        ("neutral", "Neutralny"),
        ("aggressive", "Agresywny wobec innych zwierząt")
    ]
    animal_friendly = models.CharField(
        "Stosunek do innych zwierząt", max_length=20, choices=ANIMAL_FRIENDLY_CHOICES, blank=True, null=True
    )

    BEST_HOME_CHOICES = [
        ("no_kids", "Dom bez małych dzieci"),
        ("no_other_pets", "Dom bez innych zwierząt"),
        ("any", "Dowolny dom")
    ]
    best_home = models.CharField(
        "Najlepszy dom do adopcji", max_length=30, choices=BEST_HOME_CHOICES, blank=True, null=True
    )

    sterilized = models.BooleanField("Sterylizacja/kastracja", default=False)
    vaccinated = models.BooleanField("Szczepienia", default=False)
    dewormed = models.BooleanField("Odrobaczenie", default=False)
    chipped = models.BooleanField("Mikroczip", default=False)

    HEALTH_STATUS_CHOICES = [
        ("healthy", "Zdrowy"),
        ("minor_issues", "Drobne problemy zdrowotne"),
        ("chronic", "Choroby przewlekłe"),
    ]
    health_status = models.CharField(
        "Stan zdrowia", max_length=30, choices=HEALTH_STATUS_CHOICES, blank=True, null=True
    )

    EXAMINATIONS_CHOICES = [
        ("none", "Brak"),
        ("basic", "Podstawowe"),
        ("full", "Pełne"),
    ]
    examinations = models.CharField(
        "Badania", max_length=20, choices=EXAMINATIONS_CHOICES, blank=True, null=True
    )

    last_vet_visit = models.DateField("Data ostatniej wizyty u weterynarza", blank=True, null=True)
    adoption_date = models.DateField("Data adopcji", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="liked_animals",
        blank=True,
        verbose_name="Polubione przez"
    )

    def __str__(self):
        return f"{self.name} ({self.breed or 'rasa nieznana'})"
    
class AnimalImage(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="images")
    image_data = models.BinaryField("Zdjęcie (binarnie)")
    phone_number = models.CharField("Numer telefonu", max_length=20, blank=True, null=True)
    address = models.TextField("Adres", blank=True, null=True)

class AdoptionApplication(models.Model):
    DECISION_CHOICES = [
        ("pending", "Oczekuje na decyzję"),
        ("approved", "Zatwierdzony"),
        ("rejected", "Odrzucony"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="adoption_applications",
        verbose_name="Użytkownik"
    )
    animal = models.ForeignKey(
        Animal,
        on_delete=models.CASCADE,
        related_name="adoption_applications",
        verbose_name="Zwierzę"
    )
    phone_number = models.CharField("Numer telefonu", max_length=20, blank=True)  # <---
    address = models.TextField("Adres", blank=True)  # <---
    submitted_at = models.DateTimeField(
        "Data złożenia wniosku",
        auto_now_add=True
    )
    decision = models.CharField(
        "Decyzja",
        max_length=20,
        choices=DECISION_CHOICES,
        default="pending"
    )
    adoption_date = models.DateField(
        "Data adopcji",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Wniosek: {self.user.email} -> {self.animal.name} ({self.get_decision_display()})"
