"""
Item Repository
Data access layer for Item model
"""
from typing import Optional, List
from app.models.item import Item
from app.repositories.base_repository import BaseRepository


class ItemRepository(BaseRepository[Item]):
    """Repository for Item model with custom query methods"""
    
    def __init__(self):
        """Initialize ItemRepository with Item model"""
        super().__init__(Item)
    
    def search_by_name(self, name_pattern: str) -> List[Item]:
        """Search items by name pattern"""
        return Item.query.filter(Item.name.ilike(f'%{name_pattern}%')).all()
    
    def get_active_items(self, page: int = 1, per_page: int = 20) -> tuple[List[Item], int]:
        """Get paginated list of items"""
        return self.get_paginated(
            page=page,
            per_page=per_page,
            order_by='name',
            desc=False
        )
