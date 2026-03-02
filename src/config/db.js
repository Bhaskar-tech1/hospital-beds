const Database = require('better-sqlite3');
const path = require('path');

// Connect to SQLite DB (creates it if it doesn't exist)
// In production (Render), this will point to the persistent disk path
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'production' ? null : console.log });

// Enable Write-Ahead Logging (WAL) for better concurrency and performance
db.pragma('journal_mode = WAL');

console.log('Connected to SQLite database at', dbPath);

module.exports = db;
