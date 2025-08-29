from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'

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
    short_traits = models.CharField(
        "Krótka charakterystyka", max_length=50, choices=SHORT_TRAITS_CHOICES
    )

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

    def __str__(self):
        return f"{self.name} ({self.breed or 'rasa nieznana'})"