"""
Customer Repository
Data access layer for Customer model
"""
from typing import Optional, List
from app.models.customer import Customer
from app.repositories.base_repository import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    """Repository for Customer model with custom query methods"""
    
    def __init__(self):
        """Initialize CustomerRepository with Customer model"""
        super().__init__(Customer)
    
    def get_by_email(self, email: str) -> Optional[Customer]:
        """Get customer by email address"""
        return self.get_by_field('email', email)
    
    def email_exists(self, email: str) -> bool:
        """Check if email already exists"""
        return self.exists(email=email)
    
    def search_by_name(self, name_pattern: str) -> List[Customer]:
        """Search customers by name pattern"""
        return Customer.query.filter(Customer.name.ilike(f'%{name_pattern}%')).all()
