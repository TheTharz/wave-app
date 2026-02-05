"""
Configuration settings for different environments
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration class with common settings"""
    
    # Secret key for session management and JWT
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://localhost/wave_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # JWT Token location - only accept from Authorization header
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # CORS configuration
    CORS_HEADERS = 'Content-Type'
    CORS_SUPPORTS_CREDENTIALS = True
    
    # Pagination
    ITEMS_PER_PAGE = 20
    MAX_ITEMS_PER_PAGE = 100


class DevelopmentConfig(Config):
    """Development environment configuration"""
    
    DEBUG = True
    SQLALCHEMY_ECHO = True
    TESTING = False


class TestingConfig(Config):
    """Testing environment configuration"""
    
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'TEST_DATABASE_URL',
        'postgresql://localhost/wave_test_db'
    )
    # Disable CSRF for testing
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Production environment configuration"""
    
    DEBUG = False
    TESTING = False
    
    # JWT Cookie configuration for production
    JWT_COOKIE_SECURE = True  # Require HTTPS in production
    
    # In production, these MUST be set via environment variables
    if not os.getenv('SECRET_KEY'):
        raise ValueError("SECRET_KEY environment variable must be set in production")
    
    if not os.getenv('DATABASE_URL'):
        raise ValueError("DATABASE_URL environment variable must be set in production")


# Configuration dictionary
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
