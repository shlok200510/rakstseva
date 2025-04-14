-- Donor Table
CREATE TABLE IF NOT EXISTS donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    blood_type TEXT NOT NULL,
    city TEXT,
    phone TEXT,
    last_donation DATE
);

-- Blood Request Table
CREATE TABLE IF NOT EXISTS blood_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    units_required INTEGER,
    hospital TEXT,
    city TEXT,
    contact_number TEXT,
    request_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SOS Alerts Table
CREATE TABLE IF NOT EXISTS sos_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blood_type TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    location_description TEXT,
    hospital TEXT,
    contact_number TEXT,
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Plasma Donors Table
CREATE TABLE IF NOT EXISTS plasma_donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    blood_type TEXT,
    email TEXT,
    phone TEXT,
    latitude REAL,
    longitude REAL,
    notify_emergency INTEGER DEFAULT 0,
    notify_drive INTEGER DEFAULT 0,
    notify_eligibility INTEGER DEFAULT 0,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Plasma Requests
CREATE TABLE IF NOT EXISTS plasma_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT,
    blood_type TEXT,
    hospital TEXT,
    city TEXT,
    contact_number TEXT,
    request_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
