"""
Estimate Repository
Data access layer for Estimate model
"""
from typing import Optional, List
from datetime import datetime
from app.models.estimate import Estimate, estimate_items
from app.repositories.base_repository import BaseRepository
from app.extensions import db


class EstimateRepository(BaseRepository[Estimate]):
    """Repository for Estimate model with custom query methods"""
    
    def __init__(self):
        """Initialize EstimateRepository with Estimate model"""
        super().__init__(Estimate)
    
    def get_by_estimate_number(self, estimate_number: str) -> Optional[Estimate]:
        """Get estimate by estimate number"""
        return self.get_by_field('estimate_number', estimate_number)
    
    def estimate_number_exists(self, estimate_number: str) -> bool:
        """Check if estimate number already exists"""
        return self.exists(estimate_number=estimate_number)
    
    def get_by_customer(self, customer_id: int, page: int = 1, per_page: int = 20) -> tuple[List[Estimate], int]:
        """Get estimates for a specific customer"""
        return self.get_paginated(
            page=page,
            per_page=per_page,
            filters={'customer_id': customer_id},
            order_by='date',
            desc=True
        )
    
    def create_estimate_with_items(self, estimate_data: dict, items_data: List[dict]) -> Estimate:
        """
        Create estimate with items
        
        Args:
            estimate_data: Estimate fields (estimate_number, customer_id, date, etc.)
            items_data: List of dicts with item_id, quantity, unit_price
        
        Returns:
            Created Estimate instance
        """
        # Create estimate
        estimate = Estimate(**estimate_data)
        db.session.add(estimate)
        db.session.flush()  # Get the estimate ID
        
        # Add items to estimate
        for item_data in items_data:
            stmt = estimate_items.insert().values(
                estimate_id=estimate.id,
                item_id=item_data['item_id'],
                quantity=item_data.get('quantity', 1),
                unit_price=item_data['unit_price']
            )
            db.session.execute(stmt)
        
        db.session.commit()
        return estimate
    
    def generate_estimate_number(self) -> str:
        """
        Generate next estimate number
        Format: EST-YYYY-XXXX (e.g., EST-2026-0001)
        """
        current_year = datetime.now().year
        prefix = f"EST-{current_year}-"
        
        # Get last estimate number for current year
        last_estimate = Estimate.query.filter(
            Estimate.estimate_number.like(f"{prefix}%")
        ).order_by(Estimate.estimate_number.desc()).first()
        
        if last_estimate:
            # Extract number and increment
            last_number = int(last_estimate.estimate_number.split('-')[-1])
            next_number = last_number + 1
        else:
            next_number = 1
        
        return f"{prefix}{next_number:04d}"
