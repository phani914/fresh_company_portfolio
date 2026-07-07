from rest_framework import permissions


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """
    Grants write access to Admin and Super Admin roles.
    Read-only access for anonymous/staff if method is SAFE_METHODS.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_admin_or_super()


class IsAdminOrSuperAdminOnly(permissions.BasePermission):
    """
    Strictly forbids access unless authenticated as Admin or Super Admin (no read for anonymous).
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_admin_or_super()


class IsSuperAdminOnly(permissions.BasePermission):
    """
    Unrestricted root-level control over system accounts and immutable audit logs.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_super_admin()
