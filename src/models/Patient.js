const db = require('../config/db');

class Patient {
    static admit(data) {
        const { name, age, disease, bed_id, is_emergency, emergency_proof } = data;
        const status = is_emergency ? 'emergency' : 'occupied';

        const insertPatient = db.prepare(`
            INSERT INTO patients (name, age, disease, bed_id, emergency_proof)
            VALUES (?, ?, ?, ?, ?)
        `);

        const updateBed = db.prepare(`
            UPDATE beds 
            SET status = ? 
            WHERE id = ?
        `);

        // Run as transaction
        const transaction = db.transaction(() => {
            const result = insertPatient.run(name, age, disease, bed_id, emergency_proof || null);
            updateBed.run(status, bed_id);
            return result.lastInsertRowid;
        });

        return transaction();
    }

    static discharge(bedId) {
        const updatePatient = db.prepare(`
            UPDATE patients 
            SET discharge_date = CURRENT_TIMESTAMP 
            WHERE bed_id = ? AND discharge_date IS NULL
        `);

        const updateBed = db.prepare(`
            UPDATE beds 
            SET status = 'available' 
            WHERE id = ?
        `);

        // Run as transaction
        const transaction = db.transaction(() => {
            const changes = updatePatient.run(bedId).changes;
            updateBed.run(bedId);
            return changes; // Number of patients discharged
        });

        return transaction();
    }

    static getActivePatientByBed(bedId) {
        const stmt = db.prepare(`
            SELECT * FROM patients 
            WHERE bed_id = ? AND discharge_date IS NULL
            ORDER BY admission_date DESC LIMIT 1
        `);
        return stmt.get(bedId);
    }
}

module.exports = Patient;
