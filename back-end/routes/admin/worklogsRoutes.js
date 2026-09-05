const worklogsController = require('../../controllers/admin/worklogsController');
const express = require('express');
const router = express.Router();

router.get('/', worklogsController.getAllWorkLogs);

router.get(
    '/employee-fillDetails/today-summary/:employee_id',
    worklogsController.getTodaySummary
);

module.exports = router;