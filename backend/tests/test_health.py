"""
Test Health Check Endpoints
"""


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/api/v1/health')
    
    assert response.status_code == 200
    data = response.get_json()
    
    assert data['status'] == 'healthy'
    assert 'database' in data
    assert data['service'] == 'wave-api'


def test_ping(client):
    """Test ping endpoint"""
    response = client.get('/api/v1/ping')
    
    assert response.status_code == 200
    data = response.get_json()
    
    assert data['message'] == 'pong'
