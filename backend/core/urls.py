from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    PublicCompanyProfileView,
    PublicServiceListView,
    PublicServiceDetailView,
    PublicProjectListView,
    PublicTeamListView,
    PublicTestimonialListView,
    PublicCareersListView,
    PublicGalleryListView,
    PublicLeadSubmissionView,
    PublicJobApplyView,
    AdminDashboardKPIView,
    AdminCompanyProfileView,
    AdminServiceViewSet,
    AdminProjectViewSet,
    AdminTeamViewSet,
    AdminTestimonialViewSet,
    AdminJobOpeningViewSet,
    AdminJobApplicationViewSet,
    AdminGalleryAlbumViewSet,
    AdminContactInquiryViewSet,
    AdminUserRoleViewSet,
    AdminAuditLogListView,
    SeedDemoDataView,
)

router = DefaultRouter()
router.register(r"services", AdminServiceViewSet, basename="admin-services")
router.register(r"projects", AdminProjectViewSet, basename="admin-projects")
router.register(r"team", AdminTeamViewSet, basename="admin-team")
router.register(r"testimonials", AdminTestimonialViewSet, basename="admin-testimonials")
router.register(r"careers", AdminJobOpeningViewSet, basename="admin-careers")
router.register(r"applications", AdminJobApplicationViewSet, basename="admin-applications")
router.register(r"gallery", AdminGalleryAlbumViewSet, basename="admin-gallery")
router.register(r"leads", AdminContactInquiryViewSet, basename="admin-leads")
router.register(r"users", AdminUserRoleViewSet, basename="admin-users")

urlpatterns = [
    # Authentication (Section 25 of SRS)
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Public Endpoints
    path("public/company/", PublicCompanyProfileView.as_view(), name="public-company"),
    path("public/services/", PublicServiceListView.as_view(), name="public-services"),
    path("public/services/<str:slug>/", PublicServiceDetailView.as_view(), name="public-service-detail"),
    path("public/projects/", PublicProjectListView.as_view(), name="public-projects"),
    path("public/team/", PublicTeamListView.as_view(), name="public-team"),
    path("public/testimonials/", PublicTestimonialListView.as_view(), name="public-testimonials"),
    path("public/careers/", PublicCareersListView.as_view(), name="public-careers"),
    path("public/careers/<int:job_id>/apply/", PublicJobApplyView.as_view(), name="public-job-apply"),
    path("public/gallery/", PublicGalleryListView.as_view(), name="public-gallery"),
    path("public/leads/", PublicLeadSubmissionView.as_view(), name="public-leads-submit"),

    # Protected Admin Endpoints
    path("admin/dashboard/kpis/", AdminDashboardKPIView.as_view(), name="admin-kpis"),
    path("admin/profile/", AdminCompanyProfileView.as_view(), name="admin-profile"),
    path("admin/audit-logs/", AdminAuditLogListView.as_view(), name="admin-audit-logs"),
    path("admin/seed-demo-data/", SeedDemoDataView.as_view(), name="seed-demo-data"),
    path("admin/", include(router.urls)),
]
