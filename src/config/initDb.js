const db = require('./db');
const fs = require('fs');
const path = require('path');

const initDb = () => {
    // Staff Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS staff (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'staff')) DEFAULT 'staff',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Beds Table - Will be populated in Phase 3
    db.exec(`
        CREATE TABLE IF NOT EXISTS beds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bed_number TEXT UNIQUE NOT NULL,
            floor_number INTEGER NOT NULL,
            ward_type TEXT NOT NULL,
            status TEXT CHECK(status IN ('available', 'occupied', 'emergency')) DEFAULT 'available'
        );
    `);

    // Patients Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            disease TEXT NOT NULL,
            bed_id INTEGER REFERENCES beds(id),
            admission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            discharge_date DATETIME,
            emergency_proof TEXT
        );
    `);

    // Seed Beds Data
    const stmt = db.prepare('SELECT COUNT(*) AS count FROM beds');
    const row = stmt.get();
    if (row.count === 0) {
        console.log('Seeding beds table...');
        const insertBed = db.prepare('INSERT INTO beds (bed_number, floor_number, ward_type, status) VALUES (?, ?, ?, ?)');

        // Seed 4 Floors (10 beds each)
        for (let floor = 1; floor <= 4; floor++) {
            const wardType = floor % 2 === 0 ? 'General' : 'ICU';
            for (let i = 1; i <= 10; i++) {
                const bedNum = `F${floor}-B${i.toString().padStart(2, '0')}`;
                insertBed.run(bedNum, floor, wardType, 'available');
            }
        }

        // Seed 2 Emergency Beds
        insertBed.run('EM-B01', 0, 'Emergency', 'emergency');
        insertBed.run('EM-B02', 0, 'Emergency', 'emergency');
        console.log('Successfully seeded 42 beds.');
    }

    console.log('Database tables initialized successfully.');
};

initDb();
