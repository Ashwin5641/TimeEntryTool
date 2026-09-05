const projectsController = require('../../controllers/admin/projectsController');
const express = require('express');
const router = express.Router();

// for projects of admin dashboard

router.post('/', projectsController.createProject);
router.get('/', projectsController.getAllprojects);
router.put('/:id', projectsController.updateProject);

// ----------------------------END-----------------------------

// for the employee fill details of employee panel

router.get('/options/employee-fillDetails', projectsController.getPrjctIdAndNameActSts)

module.exports = router;