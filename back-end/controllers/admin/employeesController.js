const employeesModel = require('../../models/admin/employeesModel');


// for the employees and employees list of admin dashboard

exports.getAllEmployees = async (req, res) => {
    const {search = '', page = 1, sort = 'newest', limit = 10} = req.query;

    try {
        const employees = await employeesModel.getAllEmployees(search, Number(page), sort, Number(limit));

        return res.status(200).json({
            success: true,
            data: employees.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(employees.total / limit),
                totalRecords: employees.total
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

exports.createEmployee = async (req, res) => {
    const {
        employee_id,
        employee_name,
        department_id,
        designation,
        role,
        status
    } = req.body;

    if (!employee_id || !employee_name || !department_id || !designation || !role || !status) {
        return res.status(400).json({
            success: false,
            messsage: 'Fill all the required fields'
        })
    }

    try {
        const existing = await employeesModel.checkEmployee_id(employee_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                messsage: 'Employee ID already exists!'
            })
        }

        await employeesModel.createEmployee(employee_id, employee_name, department_id, designation, role, status);

        return res.status(201).json({
            success: true,
            messsage: 'Employee added successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            messsage: 'Please try again later!'
        })
    }
}

exports.getEmployeeById = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await employeesModel.getEmployeeById(id);

        return res.status(200).json({
            success: true,
            data: employee
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.updateEmployee = async (req, res) => {
    const {id} = req.params;
    const {
        employee_id,
        employee_name,
        department_id,
        designation,
        role,
        status
    } = req.body;

    if (!employee_id || !employee_name || !department_id || !designation || !role || !status) {
        return res.status(400).json({
            success: false,
            message: 'Fill all the required fields'
        })
    }

    try {
        const existing = await employeesModel.checkOtherEmployee_id(id, employee_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Employee Id already exists'
            })
        }

        await employeesModel.updateEmployee(
            id,
            employee_id, 
            employee_name,
            department_id,
            designation,
            role,
            status
        )

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

// -------------------------------END-----------------------------------


// for the employees enter id of the employee's panel

exports.supervisorDetails = async (req, res) => {
    const {supervisor_id} = req.params;

    try {
        const supervisorDetails = await employeesModel.getSuperVisorDetails(supervisor_id);

        if (!supervisorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found, Please enter a valid Employee ID!'
            })
        }

        return res.status(200).json({
            success: true,
            data: supervisorDetails
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

// ====================================================
// for the meployee fill details of employee panel
// ====================================================

exports.getNonSupervisorEmployees = async (req, res) => {
    try {
        const employees = await employeesModel.getNonSupervisorEmployees();

        return res.status(200).json({
            success: true,
            data: employees
        })
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}