from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers

User = get_user_model()

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id','email','first_name','last_name','password','profile_picture']
        read_only_fields = ['profile_picture']
        

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'profile_picture_url','is_active']
        read_only_fields = ['email']  # Email shouldn't be updated

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            print(f"Profile picture URL: {obj.profile_picture.url}")  # Debug log
            return obj.profile_picture.url
        return None