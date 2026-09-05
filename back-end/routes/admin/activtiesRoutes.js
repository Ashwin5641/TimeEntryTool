const activitiesController = require('../../controllers/admin/activitiesController');
const express = require('express');
const router = express.Router();

router.post('/', activitiesController.createActivity);
router.get('/', activitiesController.getAllActivities);
router.put('/:id', activitiesController.updateActivity);

// for the employees of admin dashboard

// to get the activity name and id with active status
router.get('/options/sub-activities', activitiesController.getActivityNameAndIdStsAct);

// --------------------------END--------------------------

// to the department activities of admin dashboard

// to get the activity name and id with active status

router.get('/options/department-activities', activitiesController.getActivityNameAndIdStsAct);

// --------------------------END--------------------------

// for the employees of admin dashboard

// to get the activity name and id with active status
router.get('/options/employee-fillDetails', activitiesController.getActivityNameAndIdStsAct);

module.exports = router;