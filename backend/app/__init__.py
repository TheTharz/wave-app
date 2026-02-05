"""
Flask Application Factory
"""
from flask import Flask
from config import config_by_name


def create_app(config_name='development'):
    """
    Application factory pattern for creating Flask app instances
    
    Args:
        config_name (str): Configuration name (development, testing, production)
    
    Returns:
        Flask: Configured Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    from app.extensions import db, migrate, cors, jwt
    
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from app.routes.api.v1 import api_v1_bp
    app.register_blueprint(api_v1_bp, url_prefix='/api/v1')
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register shell context
    @app.shell_context_processor
    def make_shell_context():
        from app.extensions import db
        return {'db': db}
    
    return app


def register_error_handlers(app):
    """Register error handlers for the application"""
    
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return {'error': 'Bad request'}, 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return {'error': 'Unauthorized'}, 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return {'error': 'Forbidden'}, 403
