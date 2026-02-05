"""
Customer Service
Business logic for customer operations
"""
from typing import Optional, List, Dict, Any
from app.repositories.customer_repository import CustomerRepository


class CustomerService:
    """Service class for customer-related business logic"""
    
    def __init__(self):
        """Initialize service with repository"""
        self.customer_repository = CustomerRepository()
    
    def create_customer(self, data: Dict[str, Any]) -> Dict:
        """
        Create a new customer
        
        Args:
            data: Customer data including name, email, phone
        
        Returns:
            Created customer data dict
        
        Raises:
            ValueError: If data is invalid
        """
        # Validate required fields
        if 'name' not in data:
            raise ValueError('Customer name is required')
        
        if 'email' not in data:
            raise ValueError('Customer email is required')
        
        # Check if email already exists
        if self.customer_repository.email_exists(data['email']):
            raise ValueError('Customer with this email already exists')
        
        # Validate email format
        from app.utils.validators import validate_email
        if not validate_email(data['email']):
            raise ValueError('Invalid email format')
        
        # Create customer
        customer = self.customer_repository.create(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone')
        )
        
        return customer.to_dict()
    
    def get_customer_by_id(self, customer_id: int) -> Optional[Dict]:
        """Get customer by ID"""
        customer = self.customer_repository.get_by_id(customer_id)
        return customer.to_dict() if customer else None
    
    def get_all_customers(self, page: int = 1, per_page: int = 20) -> tuple[List[Dict], int]:
        """Get paginated list of customers"""
        customers, total = self.customer_repository.get_paginated(
            page=page,
            per_page=per_page,
            order_by='name',
            desc=False
        )
        return [customer.to_dict() for customer in customers], total
    
    def update_customer(self, customer_id: int, data: Dict[str, Any]) -> Optional[Dict]:
        """Update customer information"""
        customer = self.customer_repository.get_by_id(customer_id)
        
        if not customer:
            return None
        
        # Check if email is being changed
        if 'email' in data and data['email'] != customer.email:
            if self.customer_repository.email_exists(data['email']):
                raise ValueError('Customer with this email already exists')
            
            # Validate new email
            from app.utils.validators import validate_email
            if not validate_email(data['email']):
                raise ValueError('Invalid email format')
        
        # Update allowed fields
        allowed_fields = ['name', 'email', 'phone']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        updated_customer = self.customer_repository.update(customer_id, **update_data)
        return updated_customer.to_dict() if updated_customer else None
    
    def delete_customer(self, customer_id: int) -> bool:
        """Delete a customer"""
        return self.customer_repository.delete(customer_id)
    
    def search_customers(self, name_pattern: str) -> List[Dict]:
        """Search customers by name"""
        customers = self.customer_repository.search_by_name(name_pattern)
        return [customer.to_dict() for customer in customers]


# Create singleton instance
customer_service = CustomerService()
