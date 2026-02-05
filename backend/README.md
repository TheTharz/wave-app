# Wave Backend API

A professional Flask REST API with PostgreSQL database, following industry best practices and clean code principles.

## Features

- **Flask Application Factory Pattern**: Modular and testable application structure
- **RESTful API Design**: Well-structured API endpoints with versioning
- **PostgreSQL Integration**: Production-ready database with SQLAlchemy ORM
- **Repository Pattern**: Clean separation of data access layer
- **Service Layer**: Business logic isolated from data access and presentation
- **Database Migrations**: Flask-Migrate for version-controlled schema changes
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing configuration
- **Input Validation**: Request validation and error handling
- **Blueprints Architecture**: Organized route management
- **Comprehensive Testing**: Unit tests with pytest
- **Environment Configuration**: Multi-environment support (dev, test, prod)
- **Clean Code Standards**: PEP 8 compliance, type hints, docstrings
- **Generic Repository**: Type-safe base repository with common CRUD operations

## Project Structure

```
backend/
├── app/
│   ├── __init__.py              # Application factory
│   ├── extensions.py            # Flask extensions
│   ├── models/                  # Database models (ORM entities)
│   │   ├── __init__.py
│   │   ├── base.py             # Base model with common fields
│   │   └── user.py             # User model example
│   ├── repositories/            # Data access layer
│   │   ├── __init__.py
│   │   ├── base_repository.py  # Generic CRUD operations
│   │   └── user_repository.py  # User-specific queries
│   ├── services/                # Business logic layer
│   │   ├── __init__.py
│   │   └── user_service.py     # User business logic
│   ├── routes/                  # API routes (controllers)
│   │   └── api/
│   │       └── v1/
│   │           ├── __init__.py
│   │           ├── health.py   # Health check endpoints
│   │           └── users.py    # User endpoints
│   └── utils/                   # Utility functions
│       ├── __init__.py
│       ├── validators.py       # Input validation
│       └── responses.py        # Standardized responses
├── tests/                       # Test suite
│   ├── __init__.py
│   ├── conftest.py             # Test configuration
│   ├── test_health.py
│   └── test_user_model.py
├── migrations/                  # Database migrations
├── config.py                    # Configuration settings
├── run.py                       # Application entry point
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── .gitignore
├── README.md
└── REPOSITORY_PATTERN.md        # Repository pattern documentation
```

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)
- virtualenv (recommended)

## Installation

### 1. Clone the repository

```bash
cd /home/tharindu/projects/wave/backend
```

### 2. Create and activate virtual environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up PostgreSQL database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE wave_db;
CREATE USER wave_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE wave_db TO wave_user;
\q
```

### 5. Configure environment variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Update the following variables in `.env`:
```
DATABASE_URL=postgresql://wave_user:your_password@localhost:5432/wave_db
SECRET_KEY=your-secure-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

### 6. Initialize database migrations

```bash
# Initialize migration repository
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migration to database
flask db upgrade
```

## Running the Application

### Development Server

```bash
# Using Flask development server
flask run

# Or using run.py
python run.py

# With custom port
flask run --port=8000
```

The API will be available at `http://localhost:5000`

### Production Server

```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# With more workers and custom configuration
gunicorn -w 4 -b 0.0.0.0:5000 --access-logfile - --error-logfile - run:app
```

## API Endpoints

### Health Check

- **GET** `/api/v1/health` - Check API health status
- **GET** `/api/v1/ping` - Simple ping endpoint

### Authentication (Cookies-based JWT)

- **POST** `/api/v1/auth/register` - Register new user
- **POST** `/api/v1/auth/login` - Login and receive JWT in HTTP-only cookies
- **POST** `/api/v1/auth/logout` - Logout and clear cookies (JWT required)
- **POST** `/api/v1/auth/refresh` - Refresh access token (Refresh token required)
- **GET** `/api/v1/auth/me` - Get current authenticated user (JWT required)

**See [AUTHENTICATION.md](AUTHENTICATION.md) for detailed authentication documentation.**

### Users (JWT Required)

- **GET** `/api/v1/users` - Get all users (paginated)
- **GET** `/api/v1/users/<id>` - Get user by ID
- **POST** `/api/v1/users` - Create new user
- **PUT** `/api/v1/users/<id>` - Update user
- **DELETE** `/api/v1/users/<id>` - Delete user

### Example API Calls

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Login (cookies saved to cookies.txt)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get current user (using cookies and CSRF token)
CSRF_TOKEN=$(grep csrf_access_token cookies.txt | awk '{print $7}')
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "X-CSRF-TOKEN: $CSRF_TOKEN" \
  -b cookies.txt
```

For more authentication examples, see [AUTHENTICATION.md](AUTHENTICATION.md)

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_health.py

# Run with verbose output
pytest -v
```

## Database Migrations

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback migration
flask db downgrade

# View migration history
flask db history
```

## Code Quality

```bash
# Format code with Black
black app/ tests/

# Check code style with Flake8
flake8 app/ tests/

# Type checking (if using mypy)
mypy app/
```

## Environment Configuration

The application supports three environments:

- **Development**: Debug mode enabled, verbose logging
- **Testing**: For running tests, separate test database
- **Production**: Optimized for production deployment

Set the environment using:
```bash
export FLASK_ENV=development  # or testing, production
```

## Design Patterns & Best Practices

### 1. Application Factory Pattern
- Enables creating multiple app instances for testing
- ImproRepository Pattern
- **Separates data access from business logic**
- Generic base repository with common CRUD operations
- Model-specific repositories for custom queries
- Easy to mock for unit testing
- Type-safe with generic typing
- See [REPOSITORY_PATTERN.md](REPOSITORY_PATTERN.md) for details

### 3. Service Layer Pattern
- Contains business logic and orchestration
- Uses repositories for data access
- Validates business rules before data operations
- Returns formatted responses to controllers

### 4. Blueprint Architecture
- Organizes routes into logical groups
- Supports API versioning (v1, v2, etc.)
- Clear separation of concerns

### 5. Base Model Pattern
- Common fields (id, created_at, updated_at) in base model
- Shared methods (save, delete, update) for all models
- DRY principle applied

### 6. Dependency Injection
- Extensions initialized separately and injected into app
- Improves testability and flexibility

### 7. Layered Architecture
```
Routes → Services → Repositories → Models → Database
```
- Each layer has a single responsibility
- Easy to test, maintain, and scale
- Extensions initialized separately and injected into app
- Improves testability and flexibility

## Security Considerations

- **Password Hashing**: Using Werkzeug's secure password hashing
- **JWT Tokens**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored in .env file
- **SQL Injection Protection**: Using SQLAlchemy ORM
- **CORS Configuration**: Properly configured for production
- **Input Validation**: Request validation before processing

## Deployment

### Using Docker (Optional)

Create a `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

### Environment Variables for Production

Ensure these are set in production:
- `FLASK_ENV=production`
- `SECRET_KEY` (use a strong random key)
- `JWT_SECRET_KEY` (use a strong random key)
- `DATABASE_URL` (your PostgreSQL connection string)

## Contributing

1. Follow PEP 8 style guide
2. Write docstrings for all functions/classes
3. Add unit tests for new features
4. Update documentation as needed

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
