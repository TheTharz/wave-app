"""
Test Configuration
"""
import pytest
from app import create_app
from app.extensions import db as _db
from config import TestingConfig


@pytest.fixture(scope='session')
def app():
    """Create application for testing"""
    app = create_app('testing')
    
    with app.app_context():
        yield app


@pytest.fixture(scope='function')
def db(app):
    """Create database for testing"""
    _db.create_all()
    
    yield _db
    
    _db.session.remove()
    _db.drop_all()


@pytest.fixture(scope='function')
def client(app):
    """Create test client"""
    return app.test_client()


@pytest.fixture(scope='function')
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()
