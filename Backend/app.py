from flask import Flask, request, jsonify, g
import sqlite3
import os
from datetime import datetime
import config

app = Flask(__name__)

# Helper function to connect to the database
def get_db_connection():
    conn = sqlite3.connect(config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Helper function to get database connection for current request
def get_db():
    if 'db' not in g:
        g.db = get_db_connection()
    return g.db

# Close database connection after request
@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
# Route for the root URL
@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Raktseva API'}), 200

# Route for favicon.ico
@app.route('/favicon.ico')
def favicon():
    return '', 204
# Initialize the database
initialized = False

@app.before_request
def init_db_once():
    global initialized
    if not initialized:
        if not os.path.exists(config.DATABASE_PATH):
            conn = get_db_connection()
            with open('schema.sql') as f:
                conn.executescript(f.read())
            conn.close()
            print(f"Database initialized at {config.DATABASE_PATH}")
        initialized = True

# Route to register a donor
@app.route('/register', methods=['POST'])
def register_donor():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    blood_type = data.get('blood_type')
    city = data.get('city')
    phone = data.get('phone')
    
    if not all([name, blood_type, phone]):
        return jsonify({'error': 'Name, blood type and phone are required'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO donors (name, email, blood_type, city, phone) VALUES (?, ?, ?, ?, ?)',
        (name, email, blood_type, city, phone)
    )
    conn.commit()

    return jsonify({'message': 'Donor registered successfully'}), 201

# Route to request blood
@app.route('/request', methods=['POST'])
def request_blood():
    data = request.json
    patient_name = data.get('patient_name')
    blood_type = data.get('blood_type')
    units_required = data.get('units_required', 1)
    hospital = data.get('hospital')
    city = data.get('city')
    contact_number = data.get('contact_number')

    if not all([patient_name, blood_type, contact_number]):
        return jsonify({'error': 'Patient name, blood type and contact number are required'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO blood_requests (patient_name, blood_type, units_required, hospital, city, contact_number) VALUES (?, ?, ?, ?, ?, ?)',
        (patient_name, blood_type, units_required, hospital, city, contact_number)
    )
    conn.commit()

    return jsonify({'message': 'Blood request submitted successfully'}), 201

# Route for SOS alerts
@app.route('/sos', methods=['POST'])
def sos_alert():
    data = request.json
    blood_type = data.get('blood_type')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    location_description = data.get('location_description')
    hospital = data.get('hospital')
    contact_number = data.get('contact_number')

    if not all([blood_type, contact_number]):
        return jsonify({'error': 'Blood type and contact number are required'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO sos_alerts (blood_type, latitude, longitude, location_description, hospital, contact_number) VALUES (?, ?, ?, ?, ?, ?)',
        (blood_type, latitude, longitude, location_description, hospital, contact_number)
    )
    conn.commit()

    # In a real application, you would trigger emergency notifications here
    return jsonify({'message': 'SOS alert triggered successfully'}), 201

# Route to register plasma donor
@app.route('/plasma/register', methods=['POST'])
def register_plasma_donor():
    data = request.json
    name = data.get('name')
    age = data.get('age')
    blood_type = data.get('blood_type')
    email = data.get('email')
    phone = data.get('phone')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    notify_emergency = data.get('notify_emergency', 0)
    notify_drive = data.get('notify_drive', 0)
    notify_eligibility = data.get('notify_eligibility', 0)

    if not all([name, blood_type, phone]):
        return jsonify({'error': 'Name, blood type and phone are required'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO plasma_donors (name, age, blood_type, email, phone, latitude, longitude, notify_emergency, notify_drive, notify_eligibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        (name, age, blood_type, email, phone, latitude, longitude, notify_emergency, notify_drive, notify_eligibility)
    )
    conn.commit()

    return jsonify({'message': 'Plasma donor registered successfully'}), 201

# Route to request plasma
@app.route('/plasma/request', methods=['POST'])
def request_plasma():
    data = request.json
    patient_name = data.get('patient_name')
    blood_type = data.get('blood_type')
    hospital = data.get('hospital')
    city = data.get('city')
    contact_number = data.get('contact_number')

    if not all([patient_name, blood_type, contact_number]):
        return jsonify({'error': 'Patient name, blood type and contact number are required'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO plasma_requests (patient_name, blood_type, hospital, city, contact_number) VALUES (?, ?, ?, ?, ?)',
        (patient_name, blood_type, hospital, city, contact_number)
    )
    conn.commit()

    return jsonify({'message': 'Plasma request submitted successfully'}), 201

# Route to get all donors
@app.route('/donors', methods=['GET'])
def get_donors():
    conn = get_db()
    donors = conn.execute('SELECT * FROM donors').fetchall()
    return jsonify([dict(donor) for donor in donors])

# Route to get all blood requests
@app.route('/requests', methods=['GET'])
def get_requests():
    conn = get_db()
    requests = conn.execute('SELECT * FROM blood_requests').fetchall()
    return jsonify([dict(req) for req in requests])

# Route to get all SOS alerts
@app.route('/sos/alerts', methods=['GET'])
def get_sos_alerts():
    conn = get_db()
    alerts = conn.execute('SELECT * FROM sos_alerts ORDER BY triggered_at DESC').fetchall()
    return jsonify([dict(alert) for alert in alerts])

# Route to get plasma donors
@app.route('/plasma/donors', methods=['GET'])
def get_plasma_donors():
    conn = get_db()
    donors = conn.execute('SELECT * FROM plasma_donors').fetchall()
    return jsonify([dict(donor) for donor in donors])

# Route to get plasma requests
@app.route('/plasma/requests', methods=['GET'])
def get_plasma_requests():
    conn = get_db()
    requests = conn.execute('SELECT * FROM plasma_requests ORDER BY request_time DESC').fetchall()
    return jsonify([dict(req) for req in requests])

if __name__ == '__main__':
    app.run(debug=config.DEBUG)
