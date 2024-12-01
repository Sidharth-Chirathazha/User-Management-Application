from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserProfileSerializer
from djoser.views import UserViewSet
from rest_framework import viewsets
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.db.models import Q

logger = logging.getLogger(__name__)

User = get_user_model()


# Create your views here.

class CustomUserViewSet(UserViewSet):

    serializer_class = UserProfileSerializer
    

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self,request):
        serializer = UserProfileSerializer(request.user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, user_id=None):
        """Update specific fields of the user profile (partial update)."""
        if user_id and request.user.is_staff:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = request.user

        is_admin_request = request.user.is_staff
        allowed_fields = ["first_name", "last_name", "profile_picture","profile_picture_url"]
        print(request.data)
        if is_admin_request:
            allowed_fields.append("is_active")

        update_data = {key: value for key,value in request.data.items() if key in allowed_fields}

        logger.debug(f"Filtered update data: {update_data}")
        print(update_data)

        serializer = UserProfileSerializer(user, data=update_data, partial=True)
        if serializer.is_valid():
            print('serializer valid')
            serializer.save()
            return Response(serializer.data)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminLoginView(APIView):
    
    def post(self,request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user and user.is_staff:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access":str(refresh.access_token),
                "refresh": str(refresh),
            })
        
        return Response(
            {"detail": "Invalid credentials or not an admin user."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    
class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        search_query = request.GET.get('search', '') 
        users = User.objects.filter(is_superuser=False)

        if search_query:
            users = users.filter(
              Q(first_name__icontains=search_query) | Q(last_name__icontains=search_query)
            )  # Search by first or last name (case-insensitive)
            
        serializer = UserProfileSerializer(users,many=True)

        admin_details = {
            "id": request.user.id,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email
        }

        return Response({
            'users':serializer.data,
            'adminData':admin_details
        })
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)