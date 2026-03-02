const db = require('../config/db');

class Bed {
    static getAllBeds() {
        const stmt = db.prepare(`
            SELECT beds.*, patients.name AS patient_name 
            FROM beds 
            LEFT JOIN patients ON beds.id = patients.bed_id AND patients.discharge_date IS NULL
            ORDER BY beds.floor_number, beds.bed_number
        `);
        return stmt.all();
    }

    static searchBeds(query) {
        const searchTerm = `%${query}%`;
        const stmt = db.prepare(`
            SELECT beds.*, patients.name AS patient_name 
            FROM beds 
            LEFT JOIN patients ON beds.id = patients.bed_id AND patients.discharge_date IS NULL
            WHERE beds.bed_number LIKE ? 
               OR beds.floor_number LIKE ? 
               OR patients.name LIKE ?
            ORDER BY beds.floor_number, beds.bed_number
        `);
        return stmt.all(searchTerm, searchTerm, searchTerm);
    }

    static getBedSummary() {
        const stmt = db.prepare(`
            SELECT 
                COUNT(*) as totalBeds,
                SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availableBeds,
                SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupiedBeds,
                SUM(CASE WHEN status = 'emergency' THEN 1 ELSE 0 END) as emergencyBeds
            FROM beds
        `);
        return stmt.get();
    }

    static getBedByNumber(bedNumber) {
        const stmt = db.prepare('SELECT * FROM beds WHERE bed_number = ?');
        return stmt.get(bedNumber);
    }

    static updateBedStatus(id, status) {
        const stmt = db.prepare('UPDATE beds SET status = ? WHERE id = ?');
        const info = stmt.run(status, id);
        return info.changes > 0;
    }
}

module.exports = Bed;
