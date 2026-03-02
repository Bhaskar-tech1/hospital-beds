const Patient = require('../models/Patient');

exports.admitPatient = (req, res) => {
    try {
        const { name, age, disease, bed_id, is_emergency } = req.body;

        // Handle boolean parsing from FormData if needed
        const isEmergencyBool = is_emergency === 'true' || is_emergency === true;
        const emergency_proof = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !age || !disease || !bed_id) {
            return res.status(400).json({ message: 'Missing required admission fields' });
        }

        const numericBedId = parseInt(bed_id, 10);

        const newPatientId = Patient.admit({
            name,
            age,
            disease,
            bed_id: numericBedId,
            is_emergency: isEmergencyBool,
            emergency_proof
        });

        res.status(201).json({
            message: 'Patient admitted successfully',
            patientId: newPatientId
        });
    } catch (error) {
        console.error('Admit patient error:', error);
        res.status(500).json({ message: 'Internal server error while admitting patient' });
    }
};

exports.dischargePatient = (req, res) => {
    try {
        const { bed_id } = req.body;

        if (!bed_id) {
            return res.status(400).json({ message: 'Bed ID is required' });
        }

        const numericBedId = parseInt(bed_id, 10);
        const dischargedCount = Patient.discharge(numericBedId);

        if (dischargedCount === 0) {
            return res.status(404).json({ message: 'No active patient found for this bed' });
        }

        res.status(200).json({
            message: 'Patient discharged successfully',
            dischargedCount
        });
    } catch (error) {
        console.error('Discharge patient error:', error);
        res.status(500).json({ message: 'Internal server error while discharging patient' });
    }
};

exports.getPatientForBed = (req, res) => {
    try {
        const bedId = parseInt(req.params.bedId, 10);
        const patient = Patient.getActivePatientByBed(bedId);

        if (!patient) {
            return res.status(404).json({ message: 'No active patient found for this bed' });
        }

        res.status(200).json(patient);
    } catch (error) {
        console.error('Get active patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
