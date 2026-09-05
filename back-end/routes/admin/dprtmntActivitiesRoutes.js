const dprtmntActivitiesController = require('../../controllers/admin/dprtmntActivitiesController');
const express = require('express');
const router = express.Router();

router.get('/', dprtmntActivitiesController.getAllDprtmntActivities);
router.post('/', dprtmntActivitiesController.createDprtmntActivity);
router.put('/:id', dprtmntActivitiesController.updateDprtmntActivity);

// for sub activities of admin dashboard

// to get the activity name and id with active status

router.get('/options/sub-activities', dprtmntActivitiesController.getActivityByDprtmntId)

// for the employee fill details of admin dashboard

// to get the activity by department 

router.get('/options/employee-fillDetails', dprtmntActivitiesController.getActivityByDprtmntIdForEmployee);

module.exports = router;