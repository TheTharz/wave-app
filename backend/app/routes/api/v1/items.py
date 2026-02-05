"""
Item Routes
"""
from flask import jsonify, request
from app.routes.api.v1 import api_v1_bp
from app.services.item_service import item_service
from flask_jwt_extended import jwt_required


@api_v1_bp.route('/items', methods=['POST'])
@jwt_required()
def create_item():
    """
    Create a new item
    
    Request body:
        name: Item name (required)
        description: Item description (optional)
        price: Item price (required)
        tax_ids: List of tax IDs to apply (optional)
    
    Response:
        Created item details with taxes
    """
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields: name and price'}), 400
    
    try:
        item = item_service.create_item(data)
        return jsonify({
            'message': 'Item created successfully',
            'item': item
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@api_v1_bp.route('/items', methods=['GET'])
@jwt_required()
def get_items():
    """
    Get all items with pagination
    Query params: page (default: 1), per_page (default: 20)
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    items, total = item_service.get_all_items(page, per_page)
    
    return jsonify({
        'items': items,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }), 200


@api_v1_bp.route('/items/<int:item_id>', methods=['GET'])
@jwt_required()
def get_item(item_id):
    """Get item by ID"""
    item = item_service.get_item_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    return jsonify({'item': item}), 200


@api_v1_bp.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    """Update item information"""
    data = request.get_json()
    
    try:
        item = item_service.update_item(item_id, data)
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        return jsonify({
            'message': 'Item updated successfully',
            'item': item
        }), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@api_v1_bp.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    """Delete an item"""
    success = item_service.delete_item(item_id)
    
    if not success:
        return jsonify({'error': 'Item not found'}), 404
    
    return jsonify({'message': 'Item deleted successfully'}), 200


@api_v1_bp.route('/items/search', methods=['GET'])
@jwt_required()
def search_items():
    """
    Search items by name
    Query params: name (required)
    """
    name_pattern = request.args.get('name', '')
    
    if not name_pattern:
        return jsonify({'error': 'Name search pattern is required'}), 400
    
    items = item_service.search_items(name_pattern)
    
    return jsonify({
        'items': items,
        'count': len(items)
    }), 200
