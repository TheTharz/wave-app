"""
User Repository
Data access layer for User model
"""
from typing import Optional, List
from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    Repository for User model with custom query methods
    
    Extends BaseRepository to provide user-specific data access operations
    """
    
    def __init__(self):
        """Initialize UserRepository with User model"""
        super().__init__(User)
    
    def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email address
        
        Args:
            email: User email address
        
        Returns:
            User instance or None if not found
        """
        return self.get_by_field('email', email)
    
    def email_exists(self, email: str) -> bool:
        """
        Check if email already exists
        
        Args:
            email: Email address to check
        
        Returns:
            True if exists, False otherwise
        """
        return self.exists(email=email)
    
    def create_user(self, email: str, password: str, **kwargs) -> User:
        """
        Create a new user with password hashing
        
        Args:
            email: User email
            password: Plain text password
            **kwargs: Additional user fields
        
        Returns:
            Created User instance
        """
        user = User(email=email, **kwargs)
        user.set_password(password)
        
        from app.extensions import db
        db.session.add(user)
        db.session.commit()
        
        return user