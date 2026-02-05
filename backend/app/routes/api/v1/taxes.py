"""
Tax Routes
"""
from flask import jsonify
from app.routes.api.v1 import api_v1_bp
from app.models.tax import Tax
from flask_jwt_extended import jwt_required


@api_v1_bp.route('/taxes', methods=['GET'])
@jwt_required()
def get_taxes():
    """
    Get all available taxes
    No pagination needed as taxes are typically few in number
    """
    taxes = Tax.query.order_by(Tax.name).all()
    
    return jsonify({
        'taxes': [tax.to_dict() for tax in taxes]
    }), 200
