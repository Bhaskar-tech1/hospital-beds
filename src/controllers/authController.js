const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');

// In a real app, use environment variables. For this local project, a fallback is fine.
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_hospital_key_123';

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

const authUser = (req, res) => {
    const { email, password } = req.body;
    try {
        const user = Staff.findByEmail(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const registerUser = (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = Staff.findByEmail(email);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userId = Staff.create(name, email, hashedPassword, role || 'staff');

        if (userId) {
            res.status(201).json({ id: userId, name, email, role: role || 'staff' });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const getUserProfile = (req, res) => {
    try {
        const user = Staff.findById(req.user.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { authUser, registerUser, getUserProfile, JWT_SECRET };
