"""
Validation Utilities
"""
import re
from functools import wraps
from flask import request, jsonify


def validate_email(email):
    """
    Validate email format
    
    Args:
        email (str): Email address to validate
    
    Returns:
        bool: True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password):
    """
    Validate password strength
    Password must be at least 8 characters with uppercase, lowercase, and number
    
    Args:
        password (str): Password to validate
    
    Returns:
        tuple: (bool, str) - (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    
    return True, "Password is valid"


def validate_json(*expected_args):
    """
    Decorator to validate JSON request data
    
    Args:
        *expected_args: Expected keys in JSON data
    
    Returns:
        function: Decorated function
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Content-Type must be application/json'}), 400
            
            data = request.get_json()
            
            missing_fields = [field for field in expected_args if field not in data]
            if missing_fields:
                return jsonify({
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }), 400
            
            return func(*args, **kwargs)
        
        return wrapper
    
    return decorator
