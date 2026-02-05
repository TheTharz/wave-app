"""
Estimate Model
"""
from datetime import datetime
from app.models.base import BaseModel
from app.extensions import db


# Association table for many-to-many relationship between estimates and items
estimate_items = db.Table('estimate_items',
    db.Column('estimate_id', db.Integer, db.ForeignKey('estimates.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True),
    db.Column('quantity', db.Integer, nullable=False, default=1),
    db.Column('unit_price', db.Numeric(10, 2), nullable=False),  # Price at time of estimate
    db.Column('created_at', db.DateTime, default=db.func.now())
)


class Estimate(BaseModel):
    """Estimate model for managing customer estimates/quotes"""
    
    __tablename__ = 'estimates'
    
    estimate_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    valid_until = db.Column(db.Date, nullable=False)
    footer_note = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='draft', nullable=False)  # draft, sent, accepted, rejected
    
    # Relationships
    customer = db.relationship('Customer', back_populates='estimates')
    user = db.relationship('User', back_populates='estimates')
    items = db.relationship('Item', secondary=estimate_items, lazy='subquery',
                           backref=db.backref('estimates', lazy=True))
    
    def __repr__(self):
        return f'<Estimate {self.estimate_number}>'
    
    def get_estimate_items(self):
        """Get items with quantity and unit price from association table"""
        query = db.session.query(
            estimate_items.c.item_id,
            estimate_items.c.quantity,
            estimate_items.c.unit_price
        ).filter(estimate_items.c.estimate_id == self.id)
        
        return query.all()
    
    def calculate_total(self):
        """Calculate total estimate amount including taxes"""
        from app.models.item import Item
        
        total = 0
        estimate_item_data = self.get_estimate_items()
        
        for item_data in estimate_item_data:
            item = Item.query.get(item_data.item_id)
            quantity = item_data.quantity
            unit_price = float(item_data.unit_price)
            
            # Calculate item subtotal
            item_subtotal = quantity * unit_price
            
            # Calculate taxes for this item
            tax_amount = 0
            if item and item.taxes:
                for tax in item.taxes:
                    tax_amount += item_subtotal * (float(tax.amount) / 100)
            
            total += item_subtotal + tax_amount
        
        return round(total, 2)
    
    def to_dict(self, include_items=True, include_customer=True):
        """Convert estimate to dictionary"""
        data = {
            'id': self.id,
            'estimate_number': self.estimate_number,
            'customer_id': self.customer_id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'footer_note': self.footer_note,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_customer and self.customer:
            data['customer'] = self.customer.to_dict()
        
        if include_items:
            from app.models.item import Item
            items_list = []
            estimate_item_data = self.get_estimate_items()
            
            for item_data in estimate_item_data:
                item = Item.query.get(item_data.item_id)
                if item:
                    item_dict = item.to_dict()
                    item_dict['quantity'] = item_data.quantity
                    item_dict['unit_price'] = float(item_data.unit_price)
                    item_dict['subtotal'] = item_data.quantity * float(item_data.unit_price)
                    items_list.append(item_dict)
            
            data['items'] = items_list
            data['total'] = self.calculate_total()
        
        return data
