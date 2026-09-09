const worklogsController = require('../../controllers/admin/worklogsController');
const express = require('express');
const router = express.Router();

router.get('/', worklogsController.getAllWorkLogs);

router.get(
    '/employee-fillDetails/today-summary/:employee_id',
    worklogsController.getTodaySummary
);

router.get(
    '/download',
    worklogsController.downloadWorkLogs
);

module.exports = router;