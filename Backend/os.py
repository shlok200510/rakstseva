import sqlite3
conn=sqlite3.connect("raktseva.db")
cor=conn.cursor()
# cor.execute('''INSERT INTO blood_requests (patient_name, blood_type, units_required, hospital, city, contact_number) VALUES
# ('Aarav Mehta', 'A+', 2, 'Fortis Hospital', 'Mumbai', '9876543210'),
# ('Priya Sharma', 'O-', 3, 'AIIMS', 'Delhi', '9123456789'),
# ('Rahul Verma', 'B+', 1, 'Apollo Hospital', 'Chennai', '9988776655'),
# ('Sneha Kapoor', 'AB-', 4, 'Manipal Hospital', 'Bangalore', '9811223344'),
# ('Rohit Joshi', 'O+', 2, 'Lilavati Hospital', 'Mumbai', '9001122334'),
# ('Ananya Rao', 'A-', 1, 'CMC', 'Vellore', '9834567890'),
# ('Karan Malhotra', 'B-', 2, 'KIMS', 'Hyderabad', '9776655443'),
# ('Meera Iyer', 'AB+', 3, 'Max Healthcare', 'Delhi', '9654321789'),
# ('Devansh Singh', 'O+', 1, 'Ruby Hall Clinic', 'Pune', '9345678901'),
# ('Tanya Das', 'A+', 2, 'Narayana Health', 'Kolkata', '9786543210'),
# ('Nikhil Patil', 'B+', 3, 'Sahyadri Hospital', 'Pune', '9898989898'),
# ('Ritika Jain', 'O-', 2, 'HCG Hospital', 'Ahmedabad', '9765432109');''')
conn.commit()

print(cor.execute("select * from donors").fetchall())