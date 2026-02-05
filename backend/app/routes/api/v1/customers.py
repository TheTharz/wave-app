"""
Customer Routes
"""
from flask import jsonify, request
from app.routes.api.v1 import api_v1_bp
from app.services.customer_service import customer_service
from flask_jwt_extended import jwt_required


@api_v1_bp.route('/customers', methods=['POST'])
@jwt_required()
def create_customer():
    """
    Create a new customer
    
    Request body:
        name: Customer name (required)
        email: Customer email (required)
        phone: Customer phone number (optional)
    
    Response:
        Created customer details
    """
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields: name and email'}), 400
    
    try:
        customer = customer_service.create_customer(data)
        return jsonify({
            'message': 'Customer created successfully',
            'customer': customer
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@api_v1_bp.route('/customers', methods=['GET'])
@jwt_required()
def get_customers():
    """
    Get all customers with pagination
    Query params: page (default: 1), per_page (default: 20)
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    customers, total = customer_service.get_all_customers(page, per_page)
    
    return jsonify({
        'customers': customers,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }), 200


@api_v1_bp.route('/customers/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    """Get customer by ID"""
    customer = customer_service.get_customer_by_id(customer_id)
    
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    return jsonify({'customer': customer}), 200


@api_v1_bp.route('/customers/<int:customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    """Update customer information"""
    data = request.get_json()
    
    try:
        customer = customer_service.update_customer(customer_id, data)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        return jsonify({
            'message': 'Customer updated successfully',
            'customer': customer
        }), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@api_v1_bp.route('/customers/<int:customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):
    """Delete a customer"""
    success = customer_service.delete_customer(customer_id)
    
    if not success:
        return jsonify({'error': 'Customer not found'}), 404
    
    return jsonify({'message': 'Customer deleted successfully'}), 200


@api_v1_bp.route('/customers/search', methods=['GET'])
@jwt_required()
def search_customers():
    """
    Search customers by name
    Query params: name (required)
    """
    name_pattern = request.args.get('name', '')
    
    if not name_pattern:
        return jsonify({'error': 'Name search pattern is required'}), 400
    
    customers = customer_service.search_customers(name_pattern)
    
    return jsonify({
        'customers': customers,
        'count': len(customers)
    }), 200
