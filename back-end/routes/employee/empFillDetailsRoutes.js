const empFillDetailsController = require('../../controllers/employee/empFillDetailsController');
const express = require('express');
const router = express.Router();

router.post('/', empFillDetailsController.createWorkLog);

module.exports = router;