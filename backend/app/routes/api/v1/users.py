"""
User Routes
"""
from flask import jsonify, request
from app.routes.api.v1 import api_v1_bp
from app.services.user_service import user_service
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)


@api_v1_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        user = user_service.create_user(data)
        return jsonify({
            'message': 'User registered successfully',
            'user': user
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@api_v1_bp.route('/auth/login', methods=['POST'])
def login():
    """
    Authenticate user and return JWT tokens
    
    Request body:
        email: User email address
        password: User password
    
    Response:
        Returns access_token, refresh_token, and user info
    """
    data = request.get_json()
    
    # Validate required fields
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    # Authenticate user
    user = user_service.authenticate_user(email, password)
    
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create JWT tokens
    access_token = create_access_token(identity=str(user['id']))
    refresh_token = create_refresh_token(identity=str(user['id']))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'created_at': user['created_at']
        }
    }), 200


@api_v1_bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user
    
    Note: With header-based JWT, logout is handled client-side by removing the token.
    This endpoint can be used for additional cleanup if needed.
    
    Response:
        Returns logout confirmation
    """
    return jsonify({
        'message': 'Logout successful. Please remove the token from client.'
    }), 200


@api_v1_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token from Authorization header
    
    Headers:
        Authorization: Bearer <refresh_token>
    
    Response:
        Returns new access_token
    """
    # Get current user identity from refresh token
    current_user_id = get_jwt_identity()
    
    # Create new access token
    access_token = create_access_token(identity=str(current_user_id))
    
    return jsonify({
        'message': 'Token refreshed successfully',
        'access_token': access_token
    }), 200


@api_v1_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current authenticated user information
    
    Response:
        Returns current user details
    """
    current_user_id = get_jwt_identity()
    user = user_service.get_user_by_id(int(current_user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user
    }), 200
