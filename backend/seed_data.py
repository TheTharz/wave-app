"""
Seed Database with Sample Data
Run this script to populate the database with sample customers, taxes, and items
"""
from app import create_app
from app.extensions import db
from app.models.customer import Customer
from app.models.tax import Tax
from app.models.item import Item


def seed_data():
    """Seed the database with sample data"""
    
    app = create_app('development')
    
    with app.app_context():
        print("Starting database seeding...")
        
        # Create Taxes
        print("\n📊 Creating taxes...")
        taxes_data = [
            {'name': 'VAT', 'amount': 18.00},
            {'name': 'Service Tax', 'amount': 5.00},
            {'name': 'GST', 'amount': 12.00},
        ]
        
        taxes = []
        for tax_data in taxes_data:
            existing_tax = Tax.query.filter_by(name=tax_data['name']).first()
            if not existing_tax:
                tax = Tax(**tax_data)
                db.session.add(tax)
                taxes.append(tax)
                print(f"  ✓ Created tax: {tax_data['name']} ({tax_data['amount']}%)")
            else:
                taxes.append(existing_tax)
                print(f"  ℹ Tax already exists: {tax_data['name']}")
        
        db.session.commit()
        
        # Create Customers
        print("\n👥 Creating customers...")
        customers_data = [
            {
                'name': 'Acme Corporation',
                'email': 'contact@acme.com',
                'phone': '+1-555-0101'
            },
            {
                'name': 'Tech Innovations Ltd',
                'email': 'info@techinnovations.com',
                'phone': '+1-555-0102'
            },
            {
                'name': 'Global Solutions Inc',
                'email': 'hello@globalsolutions.com',
                'phone': '+1-555-0103'
            },
            {
                'name': 'StartUp Ventures',
                'email': 'contact@startupventures.com',
                'phone': '+1-555-0104'
            },
            {
                'name': 'Enterprise Systems',
                'email': 'sales@enterprisesystems.com',
                'phone': '+1-555-0105'
            },
        ]
        
        customers = []
        for customer_data in customers_data:
            existing_customer = Customer.query.filter_by(email=customer_data['email']).first()
            if not existing_customer:
                customer = Customer(**customer_data)
                db.session.add(customer)
                customers.append(customer)
                print(f"  ✓ Created customer: {customer_data['name']}")
            else:
                customers.append(existing_customer)
                print(f"  ℹ Customer already exists: {customer_data['name']}")
        
        db.session.commit()
        
        # Create Items with Taxes
        print("\n📦 Creating items...")
        items_data = [
            {
                'name': 'Website Development',
                'description': 'Custom website development with responsive design',
                'price': 2500.00,
                'tax_names': ['VAT', 'Service Tax']
            },
            {
                'name': 'Mobile App Development',
                'description': 'Native iOS and Android application development',
                'price': 5000.00,
                'tax_names': ['VAT', 'Service Tax']
            },
            {
                'name': 'Logo Design',
                'description': 'Professional logo design with unlimited revisions',
                'price': 500.00,
                'tax_names': ['VAT']
            },
            {
                'name': 'SEO Optimization',
                'description': 'Search engine optimization package for 3 months',
                'price': 1200.00,
                'tax_names': ['VAT', 'Service Tax']
            },
            {
                'name': 'Content Writing',
                'description': 'Professional content writing per 1000 words',
                'price': 150.00,
                'tax_names': ['VAT']
            },
            {
                'name': 'Social Media Management',
                'description': 'Monthly social media management across all platforms',
                'price': 800.00,
                'tax_names': ['Service Tax']
            },
            {
                'name': 'UI/UX Design',
                'description': 'Complete UI/UX design for web or mobile application',
                'price': 1800.00,
                'tax_names': ['VAT', 'Service Tax']
            },
            {
                'name': 'API Development',
                'description': 'RESTful API development and integration',
                'price': 3000.00,
                'tax_names': ['VAT', 'Service Tax']
            },
            {
                'name': 'Database Design',
                'description': 'Database architecture and optimization',
                'price': 1000.00,
                'tax_names': ['VAT']
            },
            {
                'name': 'Cloud Hosting Setup',
                'description': 'Cloud infrastructure setup and configuration',
                'price': 600.00,
                'tax_names': ['Service Tax']
            },
        ]
        
        items = []
        for item_data in items_data:
            existing_item = Item.query.filter_by(name=item_data['name']).first()
            if not existing_item:
                tax_names = item_data.pop('tax_names', [])
                item = Item(**item_data)
                
                # Add taxes to item
                for tax_name in tax_names:
                    tax = Tax.query.filter_by(name=tax_name).first()
                    if tax:
                        item.taxes.append(tax)
                
                db.session.add(item)
                items.append(item)
                print(f"  ✓ Created item: {item.name} (${item.price}) with taxes: {', '.join(tax_names)}")
            else:
                items.append(existing_item)
                print(f"  ℹ Item already exists: {existing_item.name}")
        
        db.session.commit()
        
        print("\n✅ Database seeding completed successfully!")
        print(f"\nSummary:")
        print(f"  - Taxes: {Tax.query.count()}")
        print(f"  - Customers: {Customer.query.count()}")
        print(f"  - Items: {Item.query.count()}")


if __name__ == '__main__':
    seed_data()
