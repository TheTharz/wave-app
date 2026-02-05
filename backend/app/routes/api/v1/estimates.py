"""
Estimate Routes
"""
from flask import jsonify, request
from app.routes.api.v1 import api_v1_bp
from app.services.estimate_service import estimate_service
from flask_jwt_extended import jwt_required, get_jwt_identity


@api_v1_bp.route('/estimates', methods=['POST'])
@jwt_required()
def create_estimate():
    """
    Create a new estimate
    
    Request body:
        customer_id: ID of the customer
        items: List of items with item_id, quantity, unit_price (optional)
        date: Estimate date (optional, defaults to today)
        valid_until: Valid until date (optional, defaults to 30 days from now)
        footer_note: Footer note (optional)
        status: Status (optional, defaults to 'draft')
    
    Response:
        Created estimate with all details
    """
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Validate required fields
    required_fields = ['customer_id', 'items']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields: customer_id and items'}), 400
    
    try:
        estimate = estimate_service.create_estimate(int(current_user_id), data)
        return jsonify({
            'message': 'Estimate created successfully',
            'estimate': estimate
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@api_v1_bp.route('/estimates/<int:estimate_id>', methods=['GET'])
@jwt_required()
def get_estimate(estimate_id):
    """Get estimate by ID"""
    estimate = estimate_service.get_estimate_by_id(estimate_id)
    
    if not estimate:
        return jsonify({'error': 'Estimate not found'}), 404
    
    return jsonify({'estimate': estimate}), 200


@api_v1_bp.route('/estimates/number/<estimate_number>', methods=['GET'])
@jwt_required()
def get_estimate_by_number(estimate_number):
    """Get estimate by estimate number"""
    estimate = estimate_service.get_estimate_by_number(estimate_number)
    
    if not estimate:
        return jsonify({'error': 'Estimate not found'}), 404
    
    return jsonify({'estimate': estimate}), 200


@api_v1_bp.route('/customers/<int:customer_id>/estimates', methods=['GET'])
@jwt_required()
def get_customer_estimates(customer_id):
    """
    Get all estimates for a customer
    Query params: page (default: 1), per_page (default: 20)
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    estimates, total = estimate_service.get_customer_estimates(customer_id, page, per_page)
    
    return jsonify({
        'estimates': estimates,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }), 200
