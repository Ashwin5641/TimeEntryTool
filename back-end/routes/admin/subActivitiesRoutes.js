const subActivitiesController = require('../../controllers/admin/subActivitiesController');
const express = require('express');
const router = express.Router();

// for sub activities of admin dashboard
router.post('/', subActivitiesController.createSubActivity);
router.get('/', subActivitiesController.getAllSubActivities);
router.put('/:id', subActivitiesController.updateSubActivity);

// for employee fill details of employee panel
router.get('/options/employee-fillDetails', subActivitiesController.getSubActivitieNameAndIdStsAct);

module.exports = router;