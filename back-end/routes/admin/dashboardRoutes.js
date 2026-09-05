const dashboardController = require('../../controllers/admin/dashboardController');
const express = require('express');
const router = express.Router();

router.get('/', dashboardController.getKpi);

module.exports = router;