from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import AuthUser, CorporateService, ContactInquiry, SystemAuditLog, JobOpening, JobApplication
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile


class BackendSecurityAndFunctionalityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.super_admin = AuthUser.objects.create_superuser(
            username="super", email="super@microinfoweb.com", password="passWord123!", role_type="super_admin"
        )
        self.admin = AuthUser.objects.create_user(
            username="adminuser", email="admin@microinfoweb.com", password="passWord123!", role_type="admin"
        )
        self.staff = AuthUser.objects.create_user(
            username="staffuser", email="staff@microinfoweb.com", password="passWord123!", role_type="staff"
        )
        self.service = CorporateService.objects.create(
            title="AI Consulting", slug="ai-consulting", short_description="AI service", detailed_workflow="Workflow", tech_stack="Python"
        )

    def test_public_endpoints_accessible_anonymously(self):
        response = self.client.get(reverse("public-services"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_jwt_authentication_required_for_admin_endpoints(self):
        # Unauthenticated request to protected KPI endpoint
        response = self.client.get(reverse("admin-kpis"))
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Authenticate as admin
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("admin-kpis"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("kpis", response.data)

    def test_rbac_super_admin_only_endpoints(self):
        # Admin trying to access Super Admin user management should be forbidden
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("admin-users-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Super Admin should succeed
        self.client.force_authenticate(user=self.super_admin)
        response = self.client.get(reverse("admin-users-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lead_submission_and_csv_export(self):
        # Submit lead publicly
        data = {
            "sender_name": "Test Client",
            "sender_email": "client@enterprise.com",
            "sender_phone": "555-0192",
            "subject": "Cloud Project",
            "message": "We need help migrating to AWS.",
        }
        response = self.client.post(reverse("public-leads-submit"), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(ContactInquiry.objects.count(), 1)

        # Export CSV as Admin
        self.client.force_authenticate(user=self.admin)
        csv_response = self.client.get(reverse("admin-leads-export-csv"))
        self.assertEqual(csv_response.status_code, status.HTTP_200_OK)
        self.assertEqual(csv_response["Content-Type"], "text/csv")
        self.assertIn(b"client@enterprise.com", csv_response.content)

    def test_public_job_application_stores_form_payload(self):
        job = JobOpening.objects.create(
            title="Backend Engineer",
            department="Engineering",
            location="Remote",
            employment_type="Full-time",
            description="Build APIs.",
            requirements="Python and Django.",
        )
        resume = SimpleUploadedFile(
            "resume.pdf",
            b"%PDF-1.4 test resume",
            content_type="application/pdf",
        )

        response = self.client.post(
            reverse("public-job-apply", kwargs={"job_id": job.id}),
            {
                "applicant_name": "Jane Candidate",
                "applicant_email": "jane@example.com",
                "applicant_phone": "555-0100",
                "linkedin_url": "https://linkedin.com/in/jane",
                "cover_letter_notes": "I like clean Django APIs.",
                "resume_file": resume,
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        application = JobApplication.objects.get()
        self.assertEqual(application.job, job)
        self.assertEqual(application.linkedin_url, "https://linkedin.com/in/jane")
        self.assertEqual(application.cover_note, "I like clean Django APIs.")

    def test_admin_job_opening_accepts_frontend_field_aliases(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            reverse("admin-careers-list"),
            {
                "job_title": "Senior API Engineer",
                "department": "Engineering",
                "location": "Remote",
                "employment_type": "Full-time",
                "salary_range": "$130k - $180k",
                "role_description": "Own customer-facing APIs.",
                "requirements": "Django REST Framework experience.",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        job = JobOpening.objects.get(title="Senior API Engineer")
        self.assertEqual(job.description, "Own customer-facing APIs.")
        self.assertEqual(job.salary_range, "$130k - $180k")
        self.assertEqual(response.data["job_title"], "Senior API Engineer")

    def test_invalid_email_rejection_on_lead_submission(self):
        data = {
            "sender_name": "Bad Email User",
            "sender_email": "not-an-email",
            "message": "Hello",
        }
        response = self.client.post(reverse("public-leads-submit"), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("sender_email", response.data)

    def test_system_audit_log_immutable_creation(self):
        self.client.force_authenticate(user=self.admin)
        data = {"company_name": "Updated Micro Infoweb", "primary_email": "new@microinfoweb.com"}
        self.client.patch(reverse("admin-profile"), data)
        self.assertTrue(SystemAuditLog.objects.filter(action="UPDATE_PROFILE").exists())
