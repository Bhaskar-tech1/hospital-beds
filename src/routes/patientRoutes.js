const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect: verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/admit', verifyToken, upload.single('emergency_proof'), patientController.admitPatient);
router.post('/discharge', verifyToken, patientController.dischargePatient);
router.get('/bed/:bedId', verifyToken, patientController.getPatientForBed);

module.exports = router;
