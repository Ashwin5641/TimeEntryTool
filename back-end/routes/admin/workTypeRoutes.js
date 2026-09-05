const workTypeController = require('../../controllers/admin/workTypeController');
const express = require('express');
const router = express.Router();

router.post('/', workTypeController.createWorkType);
router.get('/', workTypeController.getAllWorkTypes);
router.put('/:id', workTypeController.updateWorkType);

// for department work types of admin dashboard 

// to get the work types name and id 

router.get('/options/department-work-types', workTypeController.getWorkTypeNameAndId);


module.exports = router;