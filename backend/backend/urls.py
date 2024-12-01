"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from users.views import UserProfileUpdateView,AdminLoginView,AdminUserListView,delete_user
from django.conf import settings
from django.conf.urls.static import static


# Create a router and register your CustomUserViewSet


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/',include('djoser.urls')),
    path('api/v1/auth/',include('djoser.urls.jwt')),
    path('api/v1/auth/profile/', UserProfileUpdateView.as_view(), name='profile-update'),
    path('api/v1/auth/admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('api/v1/auth/admin/userslist/', AdminUserListView.as_view(), name='admin-userslist'),
    path('api/v1/auth/profile/<int:user_id>/', UserProfileUpdateView.as_view(), name='profile-update'),
    path('api/v1/auth/admin/delete-user/<int:user_id>/', delete_user, name='delete_user')
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


