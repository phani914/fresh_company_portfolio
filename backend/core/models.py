# pyrefly: ignore [missing-import]
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class AuthUser(AbstractUser):
    class RoleType(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin"
        ADMIN = "admin", "Admin"
        STAFF = "staff", "Staff"

    role_type = models.CharField(
        max_length=20,
        choices=RoleType.choices,
        default=RoleType.STAFF,
        help_text="Role-Based Access Control (RBAC) role",
    )

    def is_super_admin(self):
        return self.role_type == self.RoleType.SUPER_ADMIN or self.is_superuser

    def is_admin_or_super(self):
        return self.role_type in [self.RoleType.SUPER_ADMIN, self.RoleType.ADMIN] or self.is_superuser


class SystemAuditLog(models.Model):
    user = models.ForeignKey(
        AuthUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=100)
    target_table = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        user_str = self.user.username if self.user else "System/Deleted"
        return f"{self.created_at.strftime('%Y-%m-%d %H:%M:%S')} - {user_str} - {self.action} on {self.target_table}"


class CompanyProfile(models.Model):
    company_name = models.CharField(max_length=100, default="Micro Infoweb")
    tagline = models.CharField(max_length=255, default="Architecting Digital Excellence for Tomorrow's Enterprises")
    logo_url = models.URLField(max_length=500, blank=True, default="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80")
    primary_email = models.EmailField(default="contact@microinfoweb.com")
    support_phone = models.CharField(max_length=50, default="+1 (555) 389-2026")
    office_address = models.TextField(default="100 Innovation Way, Tech District, Suite 400, Silicon Valley, CA")
    facebook_url = models.URLField(blank=True, default="https://facebook.com/microinfoweb")
    twitter_url = models.URLField(blank=True, default="https://twitter.com/microinfoweb")
    linkedin_url = models.URLField(blank=True, default="https://linkedin.com/company/microinfoweb")
    github_url = models.URLField(blank=True, default="https://github.com/microinfoweb")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profile"

    def __str__(self):
        return self.company_name

    @classmethod
    def get_singleton(cls):
        obj, _ = cls.objects.get_or_create(id=1)
        return obj


class CorporateService(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    icon_name = models.CharField(max_length=50, default="Globe", help_text="Lucide icon name e.g. Globe, Smartphone, Cloud, Cpu, Database, Layout")
    short_description = models.CharField(max_length=255)
    detailed_workflow = models.TextField()
    tech_stack = models.CharField(max_length=255, help_text="Comma separated tech e.g. React, Node, AWS, Docker")
    case_study_summary = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class ProjectPortfolio(models.Model):
    class CategoryChoices(models.TextChoices):
        WEB_DEV = "Web Dev", "Web Dev"
        MOBILE = "Mobile", "Mobile"
        CLOUD = "Cloud", "Cloud"
        AI_DATA = "AI & Data", "AI & Data"

    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    category = models.CharField(max_length=50, choices=CategoryChoices.choices, default=CategoryChoices.WEB_DEV)
    client_name = models.CharField(max_length=100)
    timeline = models.CharField(max_length=50, default="3 Months")
    short_description = models.CharField(max_length=255)
    detailed_description = models.TextField()
    media_url = models.URLField(max_length=500, default="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80")
    tech_stack_tags = models.JSONField(default=list, help_text="List of tag strings e.g. ['React', 'Django', 'PostgreSQL']")
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.client_name})"


class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    department = models.CharField(max_length=100, default="Engineering")
    bio = models.TextField()
    photo_url = models.URLField(max_length=500, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80")
    linkedin_url = models.URLField(blank=True, default="https://linkedin.com")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} - {self.title}"


class Testimonial(models.Model):
    client_name = models.CharField(max_length=100)
    reviewer_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    quote = models.TextField()
    star_rating = models.IntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    partner_logo_url = models.URLField(max_length=500, blank=True, default="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80")
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.client_name} ({self.company_name})"


class JobOpening(models.Model):
    title = models.CharField(max_length=150)
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=100, default="Remote")
    employment_type = models.CharField(max_length=50, default="Full-Time")
    salary_range = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    requirements = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.department}"


class JobApplication(models.Model):
    class StatusChoices(models.TextChoices):
        NEW = "New", "New"
        REVIEWING = "Reviewing", "Reviewing"
        IN_REVIEW = "In Review", "In Review"
        INTERVIEWING = "Interviewing", "Interviewing"
        OFFERED = "Offered", "Offered"
        REJECTED = "Rejected", "Rejected"
        HIRED = "Hired", "Hired"

    job = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name="applications")
    applicant_name = models.CharField(max_length=100)
    applicant_email = models.EmailField()
    applicant_phone = models.CharField(max_length=50)
    linkedin_url = models.URLField(max_length=500, blank=True)
    cover_note = models.TextField(blank=True)
    resume_file = models.FileField(upload_to="resumes/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.applicant_name} applying for {self.job.title}"


class GalleryAlbum(models.Model):
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True, default="Headquarters")
    description = models.CharField(max_length=255, blank=True)
    cover_image_url = models.URLField(max_length=500, default="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80")
    date_taken = models.DateField(null=True, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class GalleryItem(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"

    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=100)
    media_type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
    media_url = models.URLField(max_length=500)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.album.title})"


class ContactInquiry(models.Model):
    class StatusState(models.TextChoices):
        NEW = "New", "New"
        IN_PROGRESS = "In Progress", "In Progress"
        RESOLVED = "Resolved", "Resolved"
        SPAM = "Spam", "Spam"

    sender_name = models.CharField(max_length=100)
    sender_email = models.EmailField()
    sender_phone = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=150, default="General Inquiry")
    message = models.TextField()
    status_state = models.CharField(max_length=20, choices=StatusState.choices, default=StatusState.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.sender_name} - {self.subject} ({self.status_state})"
