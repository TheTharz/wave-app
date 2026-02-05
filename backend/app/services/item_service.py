"""
Item Service
Business logic for item operations
"""
from typing import Optional, List, Dict, Any
from app.repositories.item_repository import ItemRepository
from app.models.tax import Tax


class ItemService:
    """Service class for item-related business logic"""
    
    def __init__(self):
        """Initialize service with repository"""
        self.item_repository = ItemRepository()
    
    def create_item(self, data: Dict[str, Any]) -> Dict:
        """
        Create a new item
        
        Args:
            data: Item data including name, description, price, tax_ids
        
        Returns:
            Created item data dict
        
        Raises:
            ValueError: If data is invalid
        """
        # Validate required fields
        if 'name' not in data:
            raise ValueError('Item name is required')
        
        if 'price' not in data:
            raise ValueError('Item price is required')
        
        # Validate price
        try:
            price = float(data['price'])
            if price < 0:
                raise ValueError('Price must be a positive number')
        except (ValueError, TypeError):
            raise ValueError('Invalid price format')
        
        # Create item
        from app.extensions import db
        from app.models.item import Item
        
        item = Item(
            name=data['name'],
            description=data.get('description'),
            price=price
        )
        
        # Add taxes if provided
        tax_ids = data.get('tax_ids', [])
        if tax_ids:
            for tax_id in tax_ids:
                tax = Tax.query.get(tax_id)
                if not tax:
                    raise ValueError(f'Tax with ID {tax_id} not found')
                item.taxes.append(tax)
        
        db.session.add(item)
        db.session.commit()
        
        return item.to_dict(include_taxes=True)
    
    def get_item_by_id(self, item_id: int) -> Optional[Dict]:
        """Get item by ID"""
        item = self.item_repository.get_by_id(item_id)
        return item.to_dict(include_taxes=True) if item else None
    
    def get_all_items(self, page: int = 1, per_page: int = 20) -> tuple[List[Dict], int]:
        """Get paginated list of items"""
        items, total = self.item_repository.get_active_items(page, per_page)
        return [item.to_dict(include_taxes=True) for item in items], total
    
    def update_item(self, item_id: int, data: Dict[str, Any]) -> Optional[Dict]:
        """Update item information"""
        from app.extensions import db
        
        item = self.item_repository.get_by_id(item_id)
        
        if not item:
            return None
        
        # Update allowed fields
        if 'name' in data:
            item.name = data['name']
        
        if 'description' in data:
            item.description = data['description']
        
        if 'price' in data:
            try:
                price = float(data['price'])
                if price < 0:
                    raise ValueError('Price must be a positive number')
                item.price = price
            except (ValueError, TypeError):
                raise ValueError('Invalid price format')
        
        # Update taxes if provided
        if 'tax_ids' in data:
            item.taxes = []  # Clear existing taxes
            tax_ids = data.get('tax_ids', [])
            for tax_id in tax_ids:
                tax = Tax.query.get(tax_id)
                if not tax:
                    raise ValueError(f'Tax with ID {tax_id} not found')
                item.taxes.append(tax)
        
        db.session.commit()
        return item.to_dict(include_taxes=True)
    
    def delete_item(self, item_id: int) -> bool:
        """Delete an item"""
        return self.item_repository.delete(item_id)
    
    def search_items(self, name_pattern: str) -> List[Dict]:
        """Search items by name"""
        items = self.item_repository.search_by_name(name_pattern)
        return [item.to_dict(include_taxes=True) for item in items]


# Create singleton instance
item_service = ItemService()
