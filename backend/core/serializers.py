import os
import uuid
from rest_framework import serializers
from .models import (
    AuthUser,
    SystemAuditLog,
    CompanyProfile,
    CorporateService,
    ProjectPortfolio,
    TeamMember,
    Testimonial,
    JobOpening,
    JobApplication,
    GalleryAlbum,
    GalleryItem,
    ContactInquiry,
)


def first_form_value(value):
    if isinstance(value, list) and len(value) == 1:
        return value[0]
    return value


class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUser
        fields = ["id", "username", "email", "first_name", "last_name", "role_type", "is_active", "date_joined"]
        read_only_fields = ["id", "date_joined"]


class SystemAuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True, default="System/Deleted")

    class Meta:
        model = SystemAuditLog
        fields = ["id", "username", "action", "target_table", "details", "ip_address", "created_at"]
        read_only_fields = fields


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = "__all__"


class CorporateServiceSerializer(serializers.ModelSerializer):
    display_order = serializers.IntegerField(source="order", required=False)

    class Meta:
        model = CorporateService
        fields = "__all__"


class ProjectPortfolioSerializer(serializers.ModelSerializer):
    display_order = serializers.IntegerField(source="order", required=False)

    class Meta:
        model = ProjectPortfolio
        fields = "__all__"

    def to_internal_value(self, data):
        data = data.copy()
        tech_stack = data.pop("tech_stack", None)
        if tech_stack is not None:
            if isinstance(tech_stack, str):
                data["tech_stack_tags"] = [tag.strip() for tag in tech_stack.split(",") if tag.strip()]
            else:
                data["tech_stack_tags"] = tech_stack
        return super().to_internal_value(data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["tech_stack"] = ", ".join(instance.tech_stack_tags or [])
        return rep


class TeamMemberSerializer(serializers.ModelSerializer):
    display_order = serializers.IntegerField(source="order", required=False)

    class Meta:
        model = TeamMember
        fields = "__all__"


class TestimonialSerializer(serializers.ModelSerializer):
    display_order = serializers.IntegerField(source="order", required=False)

    class Meta:
        model = Testimonial
        fields = "__all__"


class JobOpeningSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="title", required=False)
    role_description = serializers.CharField(source="description", required=False)

    class Meta:
        model = JobOpening
        fields = "__all__"

    def to_internal_value(self, data):
        data = data.copy()
        if "job_title" in data and "title" not in data:
            data["title"] = data.pop("job_title")
        if "role_description" in data and "description" not in data:
            data["description"] = data.pop("role_description")
        return super().to_internal_value(data)


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_opening_title = serializers.CharField(source="job.title", read_only=True)
    department = serializers.CharField(source="job.department", read_only=True)
    cover_letter_notes = serializers.CharField(source="cover_note", required=False, allow_blank=True)
    status_state = serializers.CharField(source="status", required=False)

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "job_title",
            "job_opening_title",
            "department",
            "applicant_name",
            "applicant_email",
            "applicant_phone",
            "linkedin_url",
            "cover_note",
            "cover_letter_notes",
            "resume_file",
            "status",
            "status_state",
            "created_at",
        ]
        read_only_fields = ["id", "job", "created_at", "job_title", "job_opening_title", "department"]

    def to_internal_value(self, data):
        data = data.copy()
        if "cover_letter_notes" in data and "cover_note" not in data:
            data["cover_note"] = first_form_value(data.pop("cover_letter_notes"))
        if "status_state" in data and "status" not in data:
            data["status"] = first_form_value(data.pop("status_state"))
        return super().to_internal_value(data)

    def validate_resume_file(self, value):
        if not value:
            return value

        # Check file extension allow-list (.pdf, .docx, .png, .jpg)
        ext = os.path.splitext(value.name)[1].lower()
        allowed_extensions = [".pdf", ".docx", ".doc", ".png", ".jpg", ".jpeg"]
        if ext not in allowed_extensions:
            raise serializers.ValidationError(f"Unsupported file format. Allowed extensions: {', '.join(allowed_extensions)}")

        # Check file size (limit to 5MB)
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("File size must not exceed 5MB.")

        # Rename to unpredictable UUID string while preserving extension
        value.name = f"resume_{uuid.uuid4().hex}{ext}"
        return value


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = "__all__"


class GalleryAlbumSerializer(serializers.ModelSerializer):
    items = GalleryItemSerializer(many=True, read_only=True)
    display_order = serializers.IntegerField(source="order", required=False)

    class Meta:
        model = GalleryAlbum
        fields = ["id", "title", "category", "description", "cover_image_url", "date_taken", "order", "display_order", "created_at", "items"]


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_sender_email(self, value):
        if "@" not in value or "." not in value.split("@")[-1]:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value.lower()
