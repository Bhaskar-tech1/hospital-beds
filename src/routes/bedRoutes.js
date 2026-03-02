const express = require('express');
const router = express.Router();
const { getBedsData, searchBeds } = require('../controllers/bedController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/search', protect, searchBeds);
router.get('/', protect, getBedsData);

module.exports = router;
