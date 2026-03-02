const db = require('../config/db');

const Staff = {
    findByEmail: (email) => {
        return db.prepare('SELECT * FROM staff WHERE email = ?').get(email);
    },
    findById: (id) => {
        return db.prepare('SELECT id, name, email, role, created_at FROM staff WHERE id = ?').get(id);
    },
    create: (name, email, password, role = 'staff') => {
        const info = db.prepare('INSERT INTO staff (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, role);
        return info.lastInsertRowid;
    }
};

module.exports = Staff;
