"""
Test User Model
"""
from app.models.user import User


def test_user_creation(db):
    """Test creating a user"""
    user = User(
        username='testuser',
        email='test@example.com',
        first_name='Test',
        last_name='User'
    )
    user.set_password('TestPassword123')
    user.save()
    
    assert user.id is not None
    assert user.username == 'testuser'
    assert user.email == 'test@example.com'
    assert user.check_password('TestPassword123')


def test_user_password_hashing(db):
    """Test password hashing"""
    user = User(username='testuser', email='test@example.com')
    user.set_password('MySecret123')
    
    assert user.password_hash != 'MySecret123'
    assert user.check_password('MySecret123')
    assert not user.check_password('WrongPassword')


def test_user_to_dict(db):
    """Test user to_dict method"""
    user = User(
        username='testuser',
        email='test@example.com',
        first_name='Test',
        last_name='User'
    )
    user.set_password('TestPassword123')
    user.save()
    
    user_dict = user.to_dict(include_email=False)
    
    assert 'id' in user_dict
    assert 'username' in user_dict
    assert 'email' not in user_dict
    assert 'password_hash' not in user_dict
    
    user_dict_with_email = user.to_dict(include_email=True)
    assert 'email' in user_dict_with_email
