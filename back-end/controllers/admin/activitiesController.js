const activitiesModel = require('../../models/admin/activitiesModel');

exports.createActivity = async (req, res) => {
    const {activity_name, status} = req.body;

    if (!activity_name || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields!'
        })
    }

    try {
        const existing = await activitiesModel.checkActivityName(activity_name);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Activity name already exist!'
            })
        }

        await activitiesModel.createActivity(activity_name, status);

        return res.status(201).json({
            success: true,
            message: 'Activity added successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getAllActivities = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;

    try {
        const activities = await activitiesModel.getAllActivities(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: activities.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(activities.total / limit),
                totalRecords: activities.total
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

exports.updateActivity = async (req, res) => {
    const {id} = req.params;
    const {activity_name, status} = req.body;

    if (!activity_name || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        })
    }

    try {
        const existing = await activitiesModel.checkOtherActivityNameById(id, activity_name);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Activity name already exists!'
            })
        }

        await activitiesModel.updateActivity(id, activity_name, status);

        return res.status(200).json({
            success: true,
            message: 'Activity updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}



// -------------------for the subactities of admin dashboard--------------------


exports.getActivityNameAndIdStsAct = async (req, res) => {
    try {
        const result = await activitiesModel.getActivityNameAndIdStsAct();
        
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