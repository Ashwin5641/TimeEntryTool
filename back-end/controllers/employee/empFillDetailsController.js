const empFillDetailsModel = require('../../models/employee/empFillDetailsModel');

exports.createWorkLog = async (req, res) => {

    const {
        employee_id,
        entered_by_employee_id,
        department_id,
        project_id,
        activity_id,
        sub_activity_id,
        department_work_type_id,
        duration_minutes,
        remarks
    } = req.body;

    // =====================================================
    // Validate required fields
    // =====================================================

    if (
        !employee_id ||
        !entered_by_employee_id ||
        !department_id ||
        !activity_id ||
        !sub_activity_id ||
        !department_work_type_id ||
        !duration_minutes ||
        Number(duration_minutes) <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        });
    }

    // =====================================================
    // Validate IDs
    // =====================================================

    const employeeId = Number(employee_id);
    const enteredByEmployeeId = Number(entered_by_employee_id);
    const departmentId = Number(department_id);
    const activityId = Number(activity_id);
    const subActivityId = Number(sub_activity_id);
    const departmentWorkTypeId = Number(department_work_type_id);
    const durationMinutes = Number(duration_minutes);

    if (
        !Number.isInteger(employeeId) ||
        employeeId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid employee ID'
        });
    }

    if (
        !Number.isInteger(enteredByEmployeeId) ||
        enteredByEmployeeId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid entered-by employee ID'
        });
    }

    if (
        !Number.isInteger(departmentId) ||
        departmentId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid department ID'
        });
    }

    if (
        !Number.isInteger(activityId) ||
        activityId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid activity ID'
        });
    }

    if (
        !Number.isInteger(subActivityId) ||
        subActivityId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sub activity ID'
        });
    }

    if (
        !Number.isInteger(departmentWorkTypeId) ||
        departmentWorkTypeId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid work type ID'
        });
    }

    if (
        !Number.isInteger(durationMinutes) ||
        durationMinutes <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Duration must be greater than zero'
        });
    }

    // =====================================================
    // Project can be NULL
    // =====================================================

    let projectId = null;

    if (
        project_id !== null &&
        project_id !== undefined &&
        project_id !== ''
    ) {

        projectId = Number(project_id);

        if (
            !Number.isInteger(projectId) ||
            projectId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }
    }

    // =====================================================
    // Remarks can be NULL
    // =====================================================

    const cleanRemarks =
        typeof remarks === 'string' &&
        remarks.trim() !== ''
            ? remarks.trim()
            : null;

    // =====================================================
    // Create work log
    // =====================================================

    try {

        const workLogId =
            await empFillDetailsModel.createWorkLog(
                employeeId,
                enteredByEmployeeId,
                departmentId,
                projectId,
                activityId,
                subActivityId,
                departmentWorkTypeId,
                durationMinutes,
                cleanRemarks
            );

        return res.status(201).json({
            success: true,
            message: 'Submitted successfully!',
            data: {
                work_log_id: workLogId
            }
        });

    } catch (err) {

        console.error(
            'Failed to create work log:',
            err
        );

        return res.status(500).json({
            success: false,
            message:
                err?.sqlMessage ||
                'Please try again later!'
        });
    }
};