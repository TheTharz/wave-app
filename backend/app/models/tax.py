"""
Tax Model
"""
from app.models.base import BaseModel
from app.extensions import db


class Tax(BaseModel):
    """Tax model for managing tax rates"""
    
    __tablename__ = 'taxes'
    
    name = db.Column(db.String(100), nullable=False, unique=True)
    amount = db.Column(db.Numeric(5, 2), nullable=False)  # e.g., 18.00 for 18%
    
    def __repr__(self):
        return f'<Tax {self.name} - {self.amount}%>'
    
    def to_dict(self):
        """Convert tax to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'amount': float(self.amount),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
