"""
Test User Repository
"""
from app.repositories.user_repository import UserRepository
from app.models.user import User


def test_create_user(db):
    """Test creating a user through repository"""
    repo = UserRepository()
    
    user = repo.create_user(
        email='test@example.com',
        password='TestPassword123'
    )
    
    assert user.id is not None
    assert user.email == 'test@example.com'
    assert user.check_password('TestPassword123')


def test_get_by_email(db):
    """Test getting user by email"""
    repo = UserRepository()
    
    # Create user
    repo.create_user(email='john@example.com', password='Pass123')
    
    # Find user
    user = repo.get_by_email('john@example.com')
    
    assert user is not None
    assert user.email == 'john@example.com'


def test_email_exists(db):
    """Test checking if email exists"""
    repo = UserRepository()
    
    # Create user
    repo.create_user(email='exists@example.com', password='Pass123')
    
    # Check exists
    assert repo.email_exists('exists@example.com') is True
    assert repo.email_exists('notexist@example.com') is False


def test_get_active_users(db):
    """Test getting active users with pagination"""
    repo = UserRepository()
    
    # Create multiple users
    for i in range(5):
        repo.create_user(
            email=f'user{i}@example.com',
            password='Pass123'
        )
    
    # Get paginated users
    users, total = repo.get_active_users(page=1, per_page=3)
    
    assert len(users) == 3
    assert total == 5


def test_update_password(db):
    """Test updating user password"""
    repo = UserRepository()
    
    # Create user
    user = repo.create_user(
        email='updatetest@example.com',
        password='OldPass123'
    )
    
    # Update password
    updated_user = repo.update_password(user.id, 'NewPass456')
    
    assert updated_user is not None
    assert updated_user.check_password('NewPass456')
    assert not updated_user.check_password('OldPass123')


def test_soft_delete(db):
    """Test soft deleting a user"""
    repo = UserRepository()
    
    # Create user
    user = repo.create_user(email='delete@example.com', password='Pass123')
    user_id = user.id
    
    # Soft delete
    success = repo.soft_delete(user_id)
    
    assert success is True
    
    # User should still exist in database
    user = repo.get_by_id(user_id)
    assert user is not None
    
    # But is_active should be False (if field exists)
    if hasattr(user, 'is_active'):
        assert user.is_active is False


def test_search_by_email(db):
    """Test searching users by email pattern"""
    repo = UserRepository()
    
    # Create users
    repo.create_user(email='john.doe@example.com', password='Pass123')
    repo.create_user(email='jane.doe@example.com', password='Pass123')
    repo.create_user(email='bob.smith@example.com', password='Pass123')
    
    # Search for 'doe'
    results = repo.search_by_email('doe')
    
    assert len(results) == 2
    
    # Search for 'smith'
    results = repo.search_by_email('smith')
    
    assert len(results) == 1


def test_base_repository_methods(db):
    """Test base repository CRUD operations"""
    repo = UserRepository()
    
    # Test count
    initial_count = repo.count()
    
    # Test create through base method
    user = repo.create_user(email='base@example.com', password='Pass123')
    
    assert repo.count() == initial_count + 1
    
    # Test get_by_id
    found_user = repo.get_by_id(user.id)
    assert found_user is not None
    assert found_user.email == 'base@example.com'
    
    # Test update
    updated_user = repo.update(user.id, email='updated@example.com')
    assert updated_user.email == 'updated@example.com'
    
    # Test exists
    assert repo.exists(email='updated@example.com') is True
