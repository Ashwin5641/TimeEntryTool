const subActivitiesModel = require('../../models/admin/subActivitiesModel');

// for the sub activities of admin dashboard

exports.createSubActivity = async (req, res) => {
    const {
        department_id,
        activity_id, 
        sub_activity,
        status
    } = req.body;

    if (!department_id || !activity_id || !sub_activity || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        })
    }

    try {
        const department_activity_id = await subActivitiesModel.getDrptmentActivityId(department_id, activity_id);

        const existing = await subActivitiesModel.checkExisting(department_activity_id.id, sub_activity);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Subactivity already exists!'
            })
        }

        await subActivitiesModel.createSubActivity(department_activity_id.id, sub_activity, status);

        return res.status(201).json({
            success: true,
            message: 'Sub activity added successfully!'
        })
    } catch (err) {
        console.error(err)
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Subactivity already exists!"
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getAllSubActivities = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;

    try {
        const subActivities = await subActivitiesModel.getAllSubActivities(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: subActivities.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(subActivities.total / limit),
                totalRecords: subActivities.total
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.updateSubActivity = async (req, res) => {
    const {id} = req.params;
    const {department_id, activity_id, sub_activity, status} = req.body;

    if (!department_id || !activity_id || !sub_activity || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields!'
        })
    }

    try {
        const department_activity_id = await subActivitiesModel.getDrptmentActivityId(department_id, activity_id);

        const existing = await subActivitiesModel.checkOtherExistingById(id, department_activity_id.id, sub_activity);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Subactivity already exists!'
            })
        }

        await subActivitiesModel.updateSubActivity(id, department_activity_id.id, sub_activity, status);
        
        return res.status(200).json({
            success: true,
            message: 'Sub activity updated successfully!'
        })
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Sub activity already exists!'
            })
        }
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

// --------------------------END-----------------------

// for the employee fill details of employee panel
exports.getSubActivitieNameAndIdStsAct = async (req, res) => {
    try {
        const { department_id, activity_id } = req.query;

        if (!department_id) {
            return res.status(400).json({
                message: 'Department ID is required.'
            });
        }

        if (!activity_id) {
            return res.status(400).json({
                message: 'Activity ID is required.'
            });
        }

        const subActivities =
            await subActivitiesModel.getSubActivitieNameAndIdStsAct(
                department_id,
                activity_id
            );

        return res.status(200).json({
            success: false,
            data: subActivities
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: 'Failed to fetch sub activities.'
        });
    }
};