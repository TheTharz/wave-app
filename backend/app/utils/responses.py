"""
Response Utilities
Standardized API response helpers
"""
from flask import jsonify


def success_response(data=None, message=None, status_code=200):
    """
    Create a standardized success response
    
    Args:
        data: Response data
        message (str): Success message
        status_code (int): HTTP status code
    
    Returns:
        tuple: (response, status_code)
    """
    response = {
        'success': True
    }
    
    if message:
        response['message'] = message
    
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code


def error_response(message, status_code=400, errors=None):
    """
    Create a standardized error response
    
    Args:
        message (str): Error message
        status_code (int): HTTP status code
        errors (dict): Additional error details
    
    Returns:
        tuple: (response, status_code)
    """
    response = {
        'success': False,
        'error': message
    }
    
    if errors:
        response['errors'] = errors
    
    return jsonify(response), status_code


def paginated_response(items, total, page, per_page, status_code=200):
    """
    Create a standardized paginated response
    
    Args:
        items (list): List of items
        total (int): Total count
        page (int): Current page
        per_page (int): Items per page
        status_code (int): HTTP status code
    
    Returns:
        tuple: (response, status_code)
    """
    response = {
        'success': True,
        'data': items,
        'pagination': {
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
            'has_next': page * per_page < total,
            'has_prev': page > 1
        }
    }
    
    return jsonify(response), status_code
