const Bed = require('../models/Bed');

// @desc    Get all beds and summary
// @route   GET /api/beds
// @access  Private (Staff/Admin)
const getBedsData = (req, res) => {
    try {
        const beds = Bed.getAllBeds();
        const summary = Bed.getBedSummary();

        res.json({
            success: true,
            summary,
            beds
        });
    } catch (error) {
        console.error('Error fetching beds data:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching beds data' });
    }
};

// @desc    Search beds by query
// @route   GET /api/beds/search?q=...
// @access  Private (Staff/Admin)
const searchBeds = (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query) {
            return res.json({ success: true, beds: [] });
        }

        const beds = Bed.searchBeds(query);
        res.json({ success: true, beds });
    } catch (error) {
        console.error('Error searching beds:', error);
        res.status(500).json({ success: false, message: 'Server error while searching beds' });
    }
};

module.exports = {
    getBedsData,
    searchBeds
};
