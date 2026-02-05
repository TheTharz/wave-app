"""
Health Check Routes
"""
from flask import jsonify
from app.routes.api.v1 import api_v1_bp
from app.extensions import db


@api_v1_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    Returns the status of the API and database connection
    """
    try:
        # Check database connection
        db.session.execute(db.text('SELECT 1'))
        db_status = 'healthy'
    except Exception as e:
        db_status = f'unhealthy: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'service': 'wave-api',
        'version': '1.0.0'
    }), 200


@api_v1_bp.route('/ping', methods=['GET'])
def ping():
    """Simple ping endpoint"""
    return jsonify({'message': 'pong'}), 200
