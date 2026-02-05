"""
Base Repository
Generic repository pattern implementation for database operations
"""
from typing import TypeVar, Generic, List, Optional, Type, Dict, Any
from app.extensions import db

T = TypeVar('T')


class BaseRepository(Generic[T]):
    """
    Generic repository providing common CRUD operations
    
    This abstracts database operations and provides a consistent interface
    for data access across all models.
    """
    
    def __init__(self, model: Type[T]):
        """
        Initialize repository with a model class
        
        Args:
            model: SQLAlchemy model class
        """
        self.model = model
    
    def get_by_id(self, id: int) -> Optional[T]:
        """
        Get a single record by ID
        
        Args:
            id: Record ID
        
        Returns:
            Model instance or None if not found
        """
        return self.model.query.get(id)
    
    def get_all(self, filters: Optional[Dict[str, Any]] = None) -> List[T]:
        """
        Get all records, optionally filtered
        
        Args:
            filters: Dictionary of field:value pairs to filter by
        
        Returns:
            List of model instances
        """
        query = self.model.query
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        return query.all()
    
    def get_paginated(
        self,
        page: int = 1,
        per_page: int = 20,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
        desc: bool = True
    ) -> tuple[List[T], int]:
        """
        Get paginated records
        
        Args:
            page: Page number (1-indexed)
            per_page: Items per page
            filters: Dictionary of field:value pairs to filter by
            order_by: Field name to order by
            desc: Whether to order descending
        
        Returns:
            Tuple of (list of records, total count)
        """
        query = self.model.query
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        # Apply ordering
        if order_by and hasattr(self.model, order_by):
            order_column = getattr(self.model, order_by)
            query = query.order_by(order_column.desc() if desc else order_column.asc())
        
        total = query.count()
        
        # Apply pagination
        records = query.offset((page - 1) * per_page).limit(per_page).all()
        
        return records, total
    
    def get_by_field(self, field: str, value: Any) -> Optional[T]:
        """
        Get a single record by a specific field value
        
        Args:
            field: Field name
            value: Field value
        
        Returns:
            Model instance or None if not found
        """
        if not hasattr(self.model, field):
            return None
        
        return self.model.query.filter(getattr(self.model, field) == value).first()
    
    def get_many_by_field(self, field: str, value: Any) -> List[T]:
        """
        Get multiple records by a specific field value
        
        Args:
            field: Field name
            value: Field value
        
        Returns:
            List of model instances
        """
        if not hasattr(self.model, field):
            return []
        
        return self.model.query.filter(getattr(self.model, field) == value).all()
    
    def create(self, **kwargs) -> T:
        """
        Create a new record
        
        Args:
            **kwargs: Field values for the new record
        
        Returns:
            Created model instance
        """
        instance = self.model(**kwargs)
        db.session.add(instance)
        db.session.commit()
        return instance
    
    def update(self, id: int, **kwargs) -> Optional[T]:
        """
        Update a record by ID
        
        Args:
            id: Record ID
            **kwargs: Fields to update
        
        Returns:
            Updated model instance or None if not found
        """
        instance = self.get_by_id(id)
        
        if not instance:
            return None
        
        for key, value in kwargs.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        
        db.session.commit()
        return instance
    
    def delete(self, id: int) -> bool:
        """
        Delete a record by ID
        
        Args:
            id: Record ID
        
        Returns:
            True if deleted, False if not found
        """
        instance = self.get_by_id(id)
        
        if not instance:
            return False
        
        db.session.delete(instance)
        db.session.commit()
        return True
    
    def soft_delete(self, id: int) -> bool:
        """
        Soft delete a record by setting is_active to False
        
        Args:
            id: Record ID
        
        Returns:
            True if soft deleted, False if not found
        """
        if not hasattr(self.model, 'is_active'):
            return False
        
        instance = self.get_by_id(id)
        
        if not instance:
            return False
        
        instance.is_active = False
        db.session.commit()
        return True
    
    def exists(self, **kwargs) -> bool:
        """
        Check if a record exists with given criteria
        
        Args:
            **kwargs: Field:value pairs to check
        
        Returns:
            True if exists, False otherwise
        """
        query = self.model.query
        
        for key, value in kwargs.items():
            if hasattr(self.model, key):
                query = query.filter(getattr(self.model, key) == value)
        
        return query.first() is not None
    
    def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """
        Count records, optionally filtered
        
        Args:
            filters: Dictionary of field:value pairs to filter by
        
        Returns:
            Count of records
        """
        query = self.model.query
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        return query.count()
