"""
Base model with common fields and methods
"""
from datetime import datetime
from app.extensions import db


class BaseModel(db.Model):
    """Abstract base model with common fields"""
    
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def save(self):
        """Save the current instance to the database"""
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        """Delete the current instance from the database"""
        db.session.delete(self)
        db.session.commit()
    
    def update(self, **kwargs):
        """Update the current instance with provided kwargs"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow()
        db.session.commit()
        return self
    
    def to_dict(self):
        """Convert model instance to dictionary"""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }
