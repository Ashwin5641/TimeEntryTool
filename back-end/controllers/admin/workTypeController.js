const workTypeModel = require('../../models/admin/workTypeModel');

exports.createWorkType = async (req, res) => {
    const {
        work_type_name,
        status
    } = req.body

    if (!work_type_name || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields!'
        })
    }

    try {
        const existing = await workTypeModel.checkExisting(work_type_name);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Work type already exists!'
            })
        }

        await workTypeModel.createWorkType(work_type_name, status);

        return res.status(201).json({
            success: false,
            message: 'Work type added successfully!'
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getAllWorkTypes = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query

    try {
        const workTypes = await workTypeModel.getAllWorkTypes(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: workTypes.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(workTypes.total / limit),
                totalRecords: workTypes.total
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

exports.updateWorkType = async (req, res) => {
    const {id} = req.params;
    const {
        work_type_name,
        status
    } = req.body;

    if (!work_type_name || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required fields'
        })
    }

    try {
        const existing = await workTypeModel.checkOtherExisting(id, work_type_name);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Work type already exists!'
            })
        }

        await workTypeModel.updateWorkType(id, work_type_name, status);

        return res.status(200).json({
            success: true,
            message: 'Work type updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getWorkTypeNameAndId = async (req, res) => {
    try {
         const result = await workTypeModel.getWorkTypeNameAndId();

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

