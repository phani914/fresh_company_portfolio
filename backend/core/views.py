import csv
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets, generics, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
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
from .serializers import (
    AuthUserSerializer,
    SystemAuditLogSerializer,
    CompanyProfileSerializer,
    CorporateServiceSerializer,
    ProjectPortfolioSerializer,
    TeamMemberSerializer,
    TestimonialSerializer,
    JobOpeningSerializer,
    JobApplicationSerializer,
    GalleryAlbumSerializer,
    GalleryItemSerializer,
    ContactInquirySerializer,
)
from .permissions import IsAdminOrSuperAdmin, IsAdminOrSuperAdminOnly, IsSuperAdminOnly


def log_audit(request, action_name, target_table, details=""):
    """Helper to record immutable system audit log"""
    ip = request.META.get("REMOTE_ADDR")
    if "HTTP_X_FORWARDED_FOR" in request.META:
        ip = request.META["HTTP_X_FORWARDED_FOR"].split(",")[0].strip()
    user = request.user if hasattr(request, "user") and request.user and request.user.is_authenticated else None
    SystemAuditLog.objects.create(
        user=user,
        action=action_name,
        target_table=target_table,
        details=details,
        ip_address=ip,
    )


# --- Public Read & Submission Endpoints ---

class PublicCompanyProfileView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CompanyProfileSerializer

    def get_object(self):
        return CompanyProfile.get_singleton()


class PublicServiceListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CorporateServiceSerializer
    queryset = CorporateService.objects.filter(is_active=True)
    pagination_class = None


class PublicServiceDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CorporateServiceSerializer
    queryset = CorporateService.objects.filter(is_active=True)
    lookup_field = "slug"


class PublicProjectListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProjectPortfolioSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = ProjectPortfolio.objects.all()
        category = self.request.query_params.get("category")
        if category and category != "All":
            queryset = queryset.filter(category=category)
        return queryset


class PublicTeamListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.filter(is_active=True)
    pagination_class = None


class PublicTestimonialListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.filter(is_active=True)
    pagination_class = None


class PublicCareersListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobOpeningSerializer
    queryset = JobOpening.objects.filter(is_active=True)
    pagination_class = None


class PublicGalleryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = GalleryAlbumSerializer
    queryset = GalleryAlbum.objects.all()
    pagination_class = None


class PublicLeadSubmissionView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactInquirySerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "SUBMIT_LEAD", "ContactInquiry", f"New lead submitted from {instance.sender_email}")


class PublicJobApplyView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobApplicationSerializer

    def perform_create(self, serializer):
        job_id = self.kwargs.get("job_id")
        job = JobOpening.objects.get(id=job_id)
        instance = serializer.save(job=job)
        log_audit(self.request, "APPLY_JOB", "JobApplication", f"Application submitted by {instance.applicant_email} for {job.title}")


# --- Protected Admin Management Endpoints ---

class AdminDashboardKPIView(views.APIView):
    permission_classes = [IsAdminOrSuperAdminOnly]

    def get(self, request):
        total_unread_leads = ContactInquiry.objects.filter(status_state="New").count()
        new_job_apps = JobApplication.objects.filter(status="New").count()
        total_projects = ProjectPortfolio.objects.count()
        total_services = CorporateService.objects.count()

        recent_leads = ContactInquirySerializer(ContactInquiry.objects.all()[:5], many=True).data
        recent_audit_logs = SystemAuditLogSerializer(SystemAuditLog.objects.all()[:5], many=True).data

        return Response({
            "kpis": {
                "total_unread_leads": total_unread_leads,
                "new_job_applications": new_job_apps,
                "total_projects": total_projects,
                "total_services": total_services,
                "system_health_status": "99.98% Operational (Healthy)",
            },
            "recent_leads": recent_leads,
            "recent_audit_logs": recent_audit_logs,
        })


class AdminCompanyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = CompanyProfileSerializer

    def get_object(self):
        return CompanyProfile.get_singleton()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "UPDATE_PROFILE", "CompanyProfile", f"Updated company brand profile")


class AdminServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = CorporateServiceSerializer
    queryset = CorporateService.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "CREATE", "CorporateService", f"Created service: {instance.title}")

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "UPDATE", "CorporateService", f"Updated service: {instance.title}")

    def perform_destroy(self, instance):
        log_audit(self.request, "DELETE", "CorporateService", f"Deleted service: {instance.title}")
        instance.delete()


class AdminProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = ProjectPortfolioSerializer
    queryset = ProjectPortfolio.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "CREATE", "ProjectPortfolio", f"Created project: {instance.title}")

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "UPDATE", "ProjectPortfolio", f"Updated project: {instance.title}")

    def perform_destroy(self, instance):
        log_audit(self.request, "DELETE", "ProjectPortfolio", f"Deleted project: {instance.title}")
        instance.delete()


class AdminTeamViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "CREATE", "TeamMember", f"Added team member: {instance.name}")

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "UPDATE", "TeamMember", f"Updated team member: {instance.name}")

    def perform_destroy(self, instance):
        log_audit(self.request, "DELETE", "TeamMember", f"Removed team member: {instance.name}")
        instance.delete()


class AdminTestimonialViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.all()


class AdminJobOpeningViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = JobOpeningSerializer
    queryset = JobOpening.objects.all()


class AdminJobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = JobApplicationSerializer
    queryset = JobApplication.objects.all()


class AdminGalleryAlbumViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = GalleryAlbumSerializer
    queryset = GalleryAlbum.objects.all()


class AdminContactInquiryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdminOnly]
    serializer_class = ContactInquirySerializer
    queryset = ContactInquiry.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "UPDATE_STATUS", "ContactInquiry", f"Updated lead {instance.sender_email} to {instance.status_state}")

    @action(detail=False, methods=["get"], url_path="export-csv")
    def export_csv(self, request):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="inquiries_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(["ID", "Sender Name", "Email", "Phone", "Subject", "Message", "Status State", "Created At"])
        
        for lead in self.get_queryset():
            writer.writerow([
                lead.id,
                lead.sender_name,
                lead.sender_email,
                lead.sender_phone,
                lead.subject,
                lead.message,
                lead.status_state,
                lead.created_at.strftime("%Y-%m-%d %H:%M:%S")
            ])
            
        log_audit(request, "EXPORT_CSV", "ContactInquiry", "Exported inquiries spreadsheet")
        return response


class AdminUserRoleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminOnly]
    serializer_class = AuthUserSerializer
    queryset = AuthUser.objects.all().order_by("id")

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.set_password("DefaultWelcome123!")
        instance.save()
        log_audit(self.request, "CREATE_USER", "AuthUser", f"Super Admin created account for {instance.username} ({instance.role_type})")

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request, "UPDATE_USER", "AuthUser", f"Super Admin modified account {instance.username}")

    def perform_destroy(self, instance):
        log_audit(self.request, "DELETE_USER", "AuthUser", f"Super Admin deleted account {instance.username}")
        instance.delete()


class AdminAuditLogListView(generics.ListAPIView):
    permission_classes = [IsSuperAdminOnly]
    serializer_class = SystemAuditLogSerializer
    queryset = SystemAuditLog.objects.all()


# --- Sample Demo Data Seeder Endpoint ---

class SeedDemoDataView(views.APIView):
    permission_classes = [AllowAny]  # Allow triggering during setup/test

    def post(self, request):
        # Create default super admin if none exists
        if not AuthUser.objects.filter(username="admin").exists():
            admin_user = AuthUser.objects.create_superuser(
                username="admin",
                email="admin@microinfoweb.com",
                password="adminpassword123",
                role_type="super_admin",
                first_name="System",
                last_name="Architect"
            )
            log_audit(request, "SEED_INIT", "AuthUser", "Created default Super Admin account (username: admin, password: adminpassword123)")

        # Ensure singleton company profile exists
        prof = CompanyProfile.get_singleton()
        prof.company_name = "Micro Infoweb"
        prof.tagline = "Architecting Digital Excellence for Tomorrow's Enterprises"
        prof.support_phone = "+1 (800) 555-MICRO"
        prof.primary_email = "solutions@microinfoweb.com"
        prof.save()

        # Seed Corporate Services
        if not CorporateService.objects.exists():
            services = [
                ("Enterprise Web Architecture", "enterprise-web", "Globe", "High-performance, secure, and scalable web platforms built with React and Django.", "Our team conducts rigorous threat modeling, UI/UX prototyping, and cloud-native microservices engineering.", "React, TypeScript, Django, PostgreSQL, Docker", 1),
                ("Cloud & DevOps Engineering", "cloud-devops", "Cloud", "Zero-downtime CI/CD pipelines, Kubernetes orchestration, and multi-cloud infrastructure.", "We automate infrastructure as code (IaC) using Terraform and deploy fault-tolerant clusters across AWS and GCP.", "Kubernetes, Terraform, AWS, Docker, GitHub Actions", 2),
                ("AI & Big Data Analytics", "ai-big-data", "Cpu", "Custom machine learning pipelines, predictive analytics, and enterprise data lakes.", "Leveraging modern LLM integrations and distributed data computing to unlock real-time business intelligence.", "Python, PyTorch, LangChain, Snowflake, Apache Spark", 3),
                ("Mobile App Development", "mobile-app", "Smartphone", "Cross-platform iOS and Android applications with native performance and offline-first sync.", "Building responsive, gesture-rich mobile experiences using Flutter and React Native with biometrics and end-to-end encryption.", "Flutter, React Native, Swift, Kotlin, Firebase", 4),
                ("Cybersecurity & Compliance", "cybersecurity", "Database", "Comprehensive vulnerability scanning, penetration testing, and SOC 2 / GDPR compliance audits.", "We enforce zero-trust network architectures, memory-hard credential hashing, and automated security verification.", "OWASP, mTLS, Argon2, SonarQube, Vault", 5),
                ("UI/UX Design Systems", "ui-ux-design", "Layout", "Curated HSL color palettes, glassmorphic interfaces, and accessible design tokens.", "Creating stunning prototypes in Figma and translating them into pixel-perfect, WCAG 2.1 AA compliant frontend components.", "Figma, Design Tokens, Vanilla CSS, WCAG 2.1 AA, Storybook", 6),
            ]
            for title, slug, icon, short, work, stack, order in services:
                CorporateService.objects.create(title=title, slug=slug, icon_name=icon, short_description=short, detailed_workflow=work, tech_stack=stack, order=order)

        # Seed Projects Portfolio
        if not ProjectPortfolio.objects.exists():
            projects = [
                ("FinTech Global Trading Portal", "fintech-portal", "Web Dev", "Apex Financial", "4 Months", "Real-time algorithmic trading dashboard with sub-millisecond websocket execution.", "Architected a high-throughput trading console serving 500,000+ active investors with real-time charting, biometric 2FA, and instant settlement pipelines.", "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80", ["React", "TypeScript", "Django REST", "WebSockets", "PostgreSQL"], 1, True),
                ("HealthPulse AI Telemedicine App", "healthpulse-ai", "AI & Data", "BioMed Health", "6 Months", "HIPAA-compliant video diagnostics platform powered by AI symptom pre-screening.", "Integrated real-time vital sign monitoring via wearables and automated medical transcription, achieving 99.99% uptime and encrypted patient records.", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80", ["Python", "PyTorch", "WebRTC", "React Native", "Docker"], 2, True),
                ("OmniCloud Infrastructure Migration", "omnicloud-migration", "Cloud", "Logistics Global", "3 Months", "Migrated 200+ legacy on-premise servers to an auto-scaling AWS Kubernetes mesh.", "Redesigned core freight routing algorithms to run serverless, reducing operational cloud spend by 42% while improving query response times under 150ms.", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", ["Kubernetes", "AWS", "Terraform", "Go", "Redis"], 3, True),
                ("NextGen E-Commerce SuperApp", "nextgen-ecommerce", "Mobile", "RetailCorp", "5 Months", "Micro-services powered shopping app with AR product visualization and 1-click checkout.", "Implemented custom 3D AR preview engines and decentralized payment gateway integration handling over $10M in monthly gross merchandise value.", "https://images.unsplash.com/photo-1556742049-0a67d55febc2?w=800&auto=format&fit=crop&q=80", ["Flutter", "Node.js", "GraphQL", "Stripe API", "MongoDB"], 4, False),
            ]
            for title, slug, cat, client, time, short, detail, media, tags, order, feat in projects:
                ProjectPortfolio.objects.create(title=title, slug=slug, category=cat, client_name=client, timeline=time, short_description=short, detailed_description=detail, media_url=media, tech_stack_tags=tags, order=order, is_featured=feat)

        # Seed Team Members
        if not TeamMember.objects.exists():
            team = [
                ("Alex Mercer", "Chief Executive Officer & Founder", "Executive", "15+ years leading enterprise digital transformations and pioneering cloud-native architectures across Silicon Valley.", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", "https://linkedin.com", 1),
                ("Dr. Elena Rostova", "Head of AI & Data Engineering", "AI & Data", "PhD in Computer Science from MIT. Former lead researcher in autonomous neural networks and natural language systems.", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80", "https://linkedin.com", 2),
                ("Marcus Vance", "Principal Cloud Architect", "Cloud Engineering", "AWS Golden Jacket recipient. Specializes in multi-cloud Kubernetes clusters, zero-trust security, and high-frequency systems.", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", "https://linkedin.com", 3),
                ("Samantha Chen", "Lead UI/UX Design Director", "Product Design", "Passionate about rich aesthetics, glassmorphism, and intuitive human-computer interfaces. Creator of the Micro Infoweb design token system.", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80", "https://linkedin.com", 4),
            ]
            for name, title, dept, bio, photo, link, order in team:
                TeamMember.objects.create(name=name, title=title, department=dept, bio=bio, photo_url=photo, linkedin_url=link, order=order)

        # Seed Testimonials
        if not Testimonial.objects.exists():
            testis = [
                ("David K. Sterling", "VP of Technology", "Apex Financial", "Micro Infoweb transformed our legacy trading console into a blazing-fast digital powerhouse. Their attention to security and rich UI aesthetics is unmatched in the industry.", 5, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"),
                ("Sarah Jenkins", "Chief Medical Officer", "BioMed Health", "Delivering a HIPAA-compliant telemedicine platform in under 6 months seemed impossible until we partnered with Micro Infoweb. Flawless execution and zero critical bugs.", 5, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"),
                ("Michael Chang", "Global Logistics Director", "Logistics Global", "Their cloud engineering team cut our server costs by 42% while doubling our transaction throughput. Truly a world-class technology partner.", 5, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"),
            ]
            for name, title, comp, quote, stars, logo in testis:
                Testimonial.objects.create(client_name=name, reviewer_title=title, company_name=comp, quote=quote, star_rating=stars, partner_logo_url=logo)

        # Seed Careers
        if not JobOpening.objects.exists():
            jobs = [
                ("Senior Full-Stack React / Django Engineer", "Engineering", "Remote (US / EU)", "Full-Time", "We are looking for a senior full-stack engineer passionate about modern Vanilla CSS aesthetics, React SPAs, and secure Django REST APIs.", "5+ years experience with Python/Django and modern React. Strong knowledge of JWT, RBAC, and clean SQL design."),
                ("AI & Machine Learning Specialist", "AI & Data", "San Francisco, CA", "Full-Time", "Join our AI research squad to develop custom LLM pipelines, predictive analytics models, and automated data processing engines.", "MS/PhD in Computer Science or Data Science. Proficiency in PyTorch, LangChain, and distributed data systems."),
                ("Cloud Security & DevOps Architect", "Cloud Engineering", "New York, NY / Hybrid", "Full-Time", "Design and safeguard multi-cloud Kubernetes clusters, enforce SOC 2 compliance, and automate zero-downtime CI/CD pipelines.", "4+ years handling AWS/GCP infrastructures, Docker, Terraform, and rigorous vulnerability mitigation."),
            ]
            for title, dept, loc, emp, desc, req in jobs:
                JobOpening.objects.create(title=title, department=dept, location=loc, employment_type=emp, description=desc, requirements=req)

        # Seed Sample Leads
        if not ContactInquiry.objects.exists():
            leads = [
                ("Robert Thorne", "robert.thorne@enterprise-tech.io", "+1 (555) 019-2834", "Cloud Migration Project Lead", "We are looking to migrate our core enterprise database and web infrastructure to AWS. Would love to schedule a technical discovery call this Thursday.", "New"),
                ("Jessica Alba", "j.alba@retail-innovations.com", "+1 (555) 982-1142", "Mobile SuperApp Inquiry", "Interested in your mobile app development workflows. We need an iOS/Android app with AR product visualization. Budget is $150k+.", "In Progress"),
                ("Spam Bot 9000", "free-crypto@scam-mail.ru", "+00 000000000", "URGENT WINNER CLAIM", "Click here to claim 100 free Bitcoin immediately!! Visit sketchy-link.ru now!!", "Spam"),
            ]
            for name, email, phone, subj, msg, status in leads:
                ContactInquiry.objects.create(sender_name=name, sender_email=email, sender_phone=phone, subject=subj, message=msg, status_state=status)

        return Response({"status": "success", "message": "Demo data successfully seeded for Micro Infoweb!"})
