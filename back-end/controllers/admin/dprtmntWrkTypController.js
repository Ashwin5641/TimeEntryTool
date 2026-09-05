const dprtmntWrkTypModel = require('../../models/admin/dprtmntWrkTypModel');

exports.createDprtmntWrkTyp = async (req, res) => {
    const {
        department_id,
        work_type_id,
        status
    } = req.body;

    if (!department_id || !work_type_id || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        })
    }

    try {
        const existing = await dprtmntWrkTypModel.checkExisting(department_id, work_type_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Department work type already exists'
            })
        }

        await dprtmntWrkTypModel.createDprtmntWrkTyp(department_id, work_type_id, status);

        return res.status(200).json({
            success: true,
            message: 'Department work type added successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getAllDprtmmtWrkTypes = async (req, res) => {

    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;

    try {
        const deprtmntWkkTypes = await dprtmntWrkTypModel.getAllDprmntWrkTypes(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: deprtmntWkkTypes.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(deprtmntWkkTypes.total / limit),
                totalRecords: deprtmntWkkTypes.total
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

exports.updateDprtWrkTyp = async (req, res) => {
    const {id} = req.params;
    const {
        department_id,
        work_type_id,
        status
    } = req.body;

    try {
        const existing = await dprtmntWrkTypModel.checkOtherExisting(id, department_id, work_type_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Department work type already exists'
            })
        }

        await dprtmntWrkTypModel.updateDprtmntWrkTyp(id, department_id, work_type_id, status);

        return res.status(200).json({
            success: true,
            message: 'Department work type updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later'
        })
    }
}

exports.getWorkTypesByDepartmentController = async (req, res) => {
    const { department_id } = req.query;
    try {
        if (!department_id) {
            return res.status(400).json({
                message: "Department ID is required."
            });
        }

        const workTypes = await dprtmntWrkTypModel.getWorkTypesByDepartment(department_id);

        return res.status(200).json(workTypes);

    } catch (err) {
        console.error(
            "Error fetching work types by department:",
            err
        );

        return res.status(500).json({
            message: "Failed to fetch work types."
        });
    }
};