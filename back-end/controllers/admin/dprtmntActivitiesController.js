const dprtmntActivitiesModel = require('../../models/admin/dprtmntActivitiesModel');

exports.getAllDprtmntActivities = async (req, res) => {

    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;

    try {
        const departmentActivities = await dprtmntActivitiesModel.getAllDprtmntActivities(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: departmentActivities.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(departmentActivities.total / limit),
                totalRecords: departmentActivities.total
            }
        })
    } catch (err) {

    }
}

exports.createDprtmntActivity = async (req, res) => {
    const {department_id, activity_id, status} = req.body;

    if (!department_id || !activity_id || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        })
    }

    try {
        const existing = await dprtmntActivitiesModel.checkExisting(department_id, activity_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Activity Already Exists'
            })
        }

        await dprtmntActivitiesModel.createDprtmntActivity(department_id, activity_id, status);

        return res.status(201).json({
            success: true,
            message: 'Department Activity Added Successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.updateDprtmntActivity = async (req, res) => {
    const {id} = req.params;
    const {department_id, activity_id, status} = req.body;

    if (!department_id || !activity_id || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        })
    }

    try {
        const existing = await dprtmntActivitiesModel.checkOtherExistingById(id, department_id, activity_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Department activity already exists!'
            })
        }

        await dprtmntActivitiesModel.updateDprtmntActivity(id, department_id, activity_id, status);

        return res.status(200).json({
            success: false,
            message: 'Department activity updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getActivityByDprtmntId = async (req, res) => {
    const {
        department_id
    } = req.query;

    try {
        const result = await dprtmntActivitiesModel.getActivityByDprtmntId(department_id);

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getActivityByDprtmntIdForEmployee = async (req, res) => {
    const { department_id } = req.query;

    if (!department_id) {
        return res.status(400).json({
            success: false,
            message: 'Department ID is required'
        });
    }

    try {
        const activities =
            await dprtmntActivitiesModel.getActivityByDprtmntIdForEmployee(
                department_id
            );

        return res.status(200).json({
            success: true,
            data: activities
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        });
    }
};