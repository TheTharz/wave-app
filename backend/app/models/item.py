"""
Item Model
"""
from app.models.base import BaseModel
from app.extensions import db


# Association table for many-to-many relationship between items and taxes
item_taxes = db.Table('item_taxes',
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True),
    db.Column('tax_id', db.Integer, db.ForeignKey('taxes.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=db.func.now())
)


class Item(BaseModel):
    """Item model for managing products/services"""
    
    __tablename__ = 'items'
    
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)  # Base price without tax
    
    # Many-to-many relationship with taxes
    taxes = db.relationship('Tax', secondary=item_taxes, lazy='subquery',
                           backref=db.backref('items', lazy=True))
    
    def __repr__(self):
        return f'<Item {self.name}>'
    
    def to_dict(self, include_taxes=True):
        """Convert item to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_taxes:
            data['taxes'] = [tax.to_dict() for tax in self.taxes]
        
        return data
