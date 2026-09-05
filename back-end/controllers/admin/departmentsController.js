const departmentsModel = require('../../models/admin/departmentsModel');

exports.createDepartment = async (req, res) => {
    const {department_name, department_code, status} = req.body;

    if (!department_name || !department_code || !status) {
        return res.status(400).json({
            success: false,
            message: 'Fill all the required fields'
        })
    }

    try {
        const existing = await departmentsModel.getDprtmntNameAndCode(department_name, department_code);

        if (existing) {
            if (existing.department_name === department_name) {
                return res.status(409).json({
                    success: false,
                    message: 'Department name already exists!'
                })
            }

            if (existing.department_code === department_code) {
                return res.status(409).json({
                    success: false,
                    message: 'Department code already exists!'
                })
            }
        }

        await departmentsModel.createDepartment(department_name, department_code, status);

        return res.status(201).json({
            success: true,
            message: 'Department created successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.getAllDepartments = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;    

    try {
        const departments = await departmentsModel.getAllDepartments(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: departments.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(departments.total / limit),
                totalRecords: departments.total
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

exports.deleteDepartment = async (req, res) => {
    const {id} = req.params;

    try {
        await departmentsModel.deleteDepartment(id);

        return res.status(200).json({
            success: false,
            message: 'Department deleted successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.updateDepartment = async (req, res) => {
    const {id} = req.params;
    const {department_name, department_code, status} = req.body;

    if (!department_name || !department_code || !status) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        })
    }

    try {
        const existing = await departmentsModel.checkOtherNameAndCode(id, department_name, department_code);

        if (existing) {
            if (existing.department_name === department_name) {
                return res.status(409).json({
                    success: false,
                    message: 'Department name already exists!'
                })
            }

            if (existing.department_code === department_code) {
                return  res.status(409).json({
                    success: false,
                    message: 'Department code already exists!'
                })
            }
        }

        await departmentsModel.updateDepartment(id, department_name, department_code, status);

        return res.status(200).json({
            success: false,
            message: 'Department updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}


// -----------------------for the employees of admin dashboard-----------------------


exports.getDprtmntNameAndIdStsAct = async (req, res) => {
    try {
        const result = await departmentsModel.getDprtmntNameAndIdStsAct();

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