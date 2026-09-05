const dprtmntWrkTypController = require('../../controllers/admin/dprtmntWrkTypController');
const express = require('express');
const router = express.Router();

router.post('/', dprtmntWrkTypController.createDprtmntWrkTyp);
router.get('/', dprtmntWrkTypController.getAllDprtmmtWrkTypes);
router.put('/:id', dprtmntWrkTypController.updateDprtWrkTyp);


router.get('/options/employee-fillDetails',
    dprtmntWrkTypController.getWorkTypesByDepartmentController
);

module.exports = router;