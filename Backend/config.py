import os

# Database configuration
DATABASE_NAME = 'raktseva.db'
DATABASE_PATH = os.path.join(os.path.dirname(__file__), DATABASE_NAME)

# Application configuration
DEBUG = True
SECRET_KEY = 'raktseva_secret_key'  # For session management

# SOS alert configuration
SOS_NOTIFICATION_RADIUS = 25  # in kilometers - for future geospatial queries

# Admin configuration
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'raktseva@admin'  # Change in production
