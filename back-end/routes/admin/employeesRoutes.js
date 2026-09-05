const employeesController = require('../../controllers/admin/employeesController');
const express = require('express');
const router = express.Router();

// for the employees of admin dashboard

router.post('/', employeesController.createEmployee);

// --------------------------END-------------------------------

// for the employees list of admin dashboard
router.get('/employees-list', employeesController.getAllEmployees);
router.get('/employees-list/edit/:id', employeesController.getEmployeeById)
router.put('/employees-list/:id', employeesController.updateEmployee);

// --------------------------END---------------------------------

// for employee fill details page
// fetch only active non-supervisor employees

router.get(
    '/employeeEnterId/non-supervisors',
    employeesController.getNonSupervisorEmployees
);


// for the employees enter id for employee's panel

router.get(
    '/employeeEnterId/:supervisor_id',
    employeesController.supervisorDetails
);



module.exports = router;