"""
User Service
Business logic for user operations
"""
from typing import Optional, List, Dict, Any
from app.repositories.user_repository import UserRepository


class UserService:
    """
    Service class for user-related business logic
    
    This layer sits between the routes and repositories,
    handling business logic and orchestrating data operations.
    """
    
    def __init__(self):
        """Initialize service with repository"""
        self.user_repository = UserRepository()
    
    def create_user(self, data: Dict[str, Any]) -> Dict:
        """
        Create a new user
        
        Args:
            data: User data dict containing email, password, etc.
        
        Returns:
            Created user data dict
        
        Raises:
            ValueError: If email already exists or data is invalid
        """
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise ValueError('Email and password are required')
        
        # Check if email already exists
        if self.user_repository.email_exists(email):
            raise ValueError('Email already exists')
        
        # Validate email format
        from app.utils.validators import validate_email
        if not validate_email(email):
            raise ValueError('Invalid email format')
        
        # Validate password strength
        from app.utils.validators import validate_password_strength
        is_valid, message = validate_password_strength(password)
        if not is_valid:
            raise ValueError(message)
        
        # Create user through repository
        user = self.user_repository.create_user(
            email=email,
            password=password,
            **{k: v for k, v in data.items() if k not in ['email', 'password']}
        )
        
        return user.to_dict(include_email=True)
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """
        Get user by ID
        
        Args:
            user_id: User ID
        
        Returns:
            User data dict or None if not found
        """
        user = self.user_repository.get_by_id(user_id)
        return user.to_dict(include_email=True) if user else None
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """
        Authenticate a user with email and password
        
        Args:
            email: User email address
            password: Plain text password
        
        Returns:
            User data dict if authenticated, None otherwise
        """
        # Get user by email
        user = self.user_repository.get_by_email(email)
        
        if not user:
            return None
        
        # Verify password
        if not user.check_password(password):
            return None
        
        return user.to_dict(include_email=True)

# Create a singleton instance for use in routes
user_service = UserService()
