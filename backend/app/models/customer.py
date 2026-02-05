"""
Customer Model
"""
from app.models.base import BaseModel
from app.extensions import db


class Customer(BaseModel):
    """Customer model for managing customer information"""
    
    __tablename__ = 'customers'
    
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=True)
    
    # Relationship to estimates
    estimates = db.relationship('Estimate', back_populates='customer', lazy='dynamic')
    
    def __repr__(self):
        return f'<Customer {self.name}>'
    
    def to_dict(self):
        """Convert customer to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
