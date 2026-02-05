"""
Example User Model
"""
from app.models.base import BaseModel
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(BaseModel):
    """User model for authentication and user management"""
    
    __tablename__ = 'users'
    
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    estimates = db.relationship('Estimate', back_populates='user', lazy=True)
    def __repr__(self):
      return f'<User {self.username}>'
    
    def set_password(self, password):
        """Hash and set the user's password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_email=False):
        """Convert user to dictionary (exclude sensitive data)"""
        data = {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_email:
            data['email'] = self.email
        return data
