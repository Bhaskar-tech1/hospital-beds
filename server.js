const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Serve uploads from the persistent environment path if available
const uploadedFilesPath = process.env.UPLOADS_PATH || path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(uploadedFilesPath));

// Routes Setup
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/beds', require('./src/routes/bedRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));

// API Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running normally' });
});

// Setup specific routes for UI files (fallback if needed, though express.static handles direct file access)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logim.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Dashboard.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Serving API at http://localhost:${PORT}/api/health`);
});
