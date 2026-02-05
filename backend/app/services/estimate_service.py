"""
Estimate Service
Business logic for estimate operations
"""
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from app.repositories.estimate_repository import EstimateRepository
from app.repositories.user_repository import UserRepository
from app.models.customer import Customer
from app.models.item import Item


class EstimateService:
    """Service class for estimate-related business logic"""
    
    def __init__(self):
        """Initialize service with repositories"""
        self.estimate_repository = EstimateRepository()
    
    def create_estimate(self, user_id: int, data: Dict[str, Any]) -> Dict:
        """
        Create a new estimate
        
        Args:
            user_id: ID of the user creating the estimate
            data: Estimate data including customer_id, items, date, valid_until, footer_note
        
        Returns:
            Created estimate data dict
        
        Raises:
            ValueError: If data is invalid
        """
        # Validate required fields
        if 'customer_id' not in data:
            raise ValueError('Customer ID is required')
        
        if 'items' not in data or not data['items']:
            raise ValueError('At least one item is required')
        
        # Validate customer exists
        customer = Customer.query.get(data['customer_id'])
        if not customer:
            raise ValueError('Customer not found')
        
        # Validate items exist and prepare items data
        items_data = []
        for item_input in data['items']:
            if 'item_id' not in item_input:
                raise ValueError('Item ID is required for each item')
            
            item = Item.query.get(item_input['item_id'])
            if not item:
                raise ValueError(f'Item with ID {item_input["item_id"]} not found')
            
            # Use provided unit_price or item's current price
            unit_price = item_input.get('unit_price', item.price)
            quantity = item_input.get('quantity', 1)
            
            if quantity <= 0:
                raise ValueError('Quantity must be greater than 0')
            
            items_data.append({
                'item_id': item.id,
                'quantity': quantity,
                'unit_price': unit_price
            })
        
        # Generate estimate number if not provided
        estimate_number = data.get('estimate_number')
        if not estimate_number:
            estimate_number = self.estimate_repository.generate_estimate_number()
        else:
            # Check if estimate number already exists
            if self.estimate_repository.estimate_number_exists(estimate_number):
                raise ValueError('Estimate number already exists')
        
        # Set dates
        estimate_date = data.get('date')
        if estimate_date:
            if isinstance(estimate_date, str):
                estimate_date = datetime.fromisoformat(estimate_date).date()
        else:
            estimate_date = datetime.utcnow().date()
        
        valid_until = data.get('valid_until')
        if valid_until:
            if isinstance(valid_until, str):
                valid_until = datetime.fromisoformat(valid_until).date()
        else:
            # Default: valid for 30 days
            valid_until = (datetime.utcnow() + timedelta(days=30)).date()
        
        # Prepare estimate data
        estimate_data = {
            'estimate_number': estimate_number,
            'customer_id': data['customer_id'],
            'user_id': user_id,
            'date': estimate_date,
            'valid_until': valid_until,
            'footer_note': data.get('footer_note'),
            'status': data.get('status', 'draft')
        }
        
        # Create estimate with items
        estimate = self.estimate_repository.create_estimate_with_items(
            estimate_data,
            items_data
        )
        
        return estimate.to_dict(include_items=True, include_customer=True)
    
    def get_estimate_by_id(self, estimate_id: int) -> Optional[Dict]:
        """Get estimate by ID"""
        estimate = self.estimate_repository.get_by_id(estimate_id)
        return estimate.to_dict(include_items=True, include_customer=True) if estimate else None
    
    def get_estimate_by_number(self, estimate_number: str) -> Optional[Dict]:
        """Get estimate by estimate number"""
        estimate = self.estimate_repository.get_by_estimate_number(estimate_number)
        return estimate.to_dict(include_items=True, include_customer=True) if estimate else None
    
    def get_customer_estimates(self, customer_id: int, page: int = 1, per_page: int = 20) -> tuple[List[Dict], int]:
        """Get all estimates for a customer"""
        estimates, total = self.estimate_repository.get_by_customer(customer_id, page, per_page)
        return [est.to_dict(include_items=False, include_customer=False) for est in estimates], total
    
    def get_user_estimates(self, user_id: int, page: int = 1, per_page: int = 20) -> tuple[List[Dict], int]:
        """Get all estimates for a user"""
        estimates, total = self.estimate_repository.get_by_user(user_id, page, per_page)
        return [est.to_dict(include_items=True, include_customer=True) for est in estimates], total


# Create singleton instance
estimate_service = EstimateService()
