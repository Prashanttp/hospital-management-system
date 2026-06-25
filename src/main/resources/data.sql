-- Seed Patients
INSERT INTO patient (id, name, gender, birth_date, email, blood_group)
VALUES
    (1, 'Aarav Sharma', 'MALE', '1990-05-10', 'aarav.sharma@example.com', 'O_POSITIVE'),
    (2, 'Diya Patel', 'FEMALE', '1995-08-20', 'diya.patel@example.com', 'A_POSITIVE'),
    (3, 'Dishant Verma', 'MALE', '1988-03-15', 'dishant.verma@example.com', 'A_POSITIVE'),
    (4, 'Neha Iyer', 'FEMALE', '1992-12-01', 'neha.iyer@example.com', 'AB_POSITIVE'),
    (5, 'Kabir Singh', 'MALE', '1993-07-11', 'kabir.singh@example.com', 'O_POSITIVE')
ON CONFLICT (email) DO NOTHING;

-- Seed Doctors
INSERT INTO doctor (id, name, specialization, email)
VALUES
    (1, 'Dr. Rakesh Mehta', 'Cardiology', 'rakesh.mehta@example.com'),
    (2, 'Dr. Sneha Kapoor', 'Dermatology', 'sneha.kapoor@example.com'),
    (3, 'Dr. Arjun Nair', 'Orthopedics', 'arjun.nair@example.com')
ON CONFLICT (email) DO NOTHING;

-- Seed Appointments
INSERT INTO appointment (id, appointment_time, reason, doctor_id, patient_id)
VALUES
    (1, '2025-07-01 10:30:00', 'General Checkup', 1, 2),
    (2, '2025-07-02 11:00:00', 'Skin Rash', 2, 2),
    (3, '2025-07-03 09:45:00', 'Knee Pain', 3, 3),
    (4, '2025-07-04 14:00:00', 'Follow-up Visit', 1, 1),
    (5, '2025-07-05 16:15:00', 'Consultation', 1, 4),
    (6, '2025-07-06 08:30:00', 'Allergy Treatment', 2, 5)
ON CONFLICT (id) DO NOTHING;

-- Reset Postgres Sequences
SELECT setval('patient_id_seq', COALESCE((SELECT MAX(id) FROM patient), 1));
SELECT setval('doctor_id_seq', COALESCE((SELECT MAX(id) FROM doctor), 1));
SELECT setval('appointment_id_seq', COALESCE((SELECT MAX(id) FROM appointment), 1));