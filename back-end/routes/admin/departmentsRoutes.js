const departmentsController = require('../../controllers/admin/departmentsController');
const express = require('express');
const router = express.Router();

// for the departments of admin dashboard

router.post('/', departmentsController.createDepartment);
router.get('/', departmentsController.getAllDepartments);
router.delete('/:id', departmentsController.deleteDepartment);
router.put('/:id', departmentsController.updateDepartment);


// ------------------------END--------------------------------


// for employees of the admin dashboard

// to get department name and id with active status
router.get('/options/employees', departmentsController.getDprtmntNameAndIdStsAct);


// ------------------------END--------------------------------


// for department activities of admin dashboard

// to get department name and id with active status

router.get('/options/department-activities', departmentsController.getDprtmntNameAndIdStsAct);


// for sub activities of admin dashboard

// to get department name and id with active status
router.get('/options/sub-activities', departmentsController.getDprtmntNameAndIdStsAct)

// ------------------------END--------------------------------

// for department work types of admin dashboard

// to get department name and id with active
router.get('/options/department-work-types', departmentsController.getDprtmntNameAndIdStsAct)

// ------------------------END--------------------------------


// for employee fill details of employee panel

// to get department name and id with active status
router.get('/options/employee-fillDetails', departmentsController.getDprtmntNameAndIdStsAct)

// ------------------------END--------------------------------


module.exports = router;