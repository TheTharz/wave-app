"""
API v1 Blueprint
"""
from flask import Blueprint

api_v1_bp = Blueprint('api_v1', __name__)

# Import routes after blueprint creation to avoid circular imports
from app.routes.api.v1 import health, users, estimates, customers, items, taxes
