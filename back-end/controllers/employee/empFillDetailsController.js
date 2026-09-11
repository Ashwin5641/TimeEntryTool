const db = require('../../config/db');
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

    if (
        !employee_id ||
        !entered_by_employee_id ||
        !department_id ||
        !department_work_type_id ||
        !duration_minutes
    ) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields'
        });
    }

    const employeeId = Number(employee_id);
    const enteredByEmployeeId = Number(entered_by_employee_id);
    const departmentId = Number(department_id);
    const departmentWorkTypeId = Number(department_work_type_id);
    const durationMinutes = Number(duration_minutes);

    if (!Number.isInteger(employeeId) || employeeId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid employee ID'
        });
    }

    if (!Number.isInteger(enteredByEmployeeId) || enteredByEmployeeId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid entered-by employee ID'
        });
    }

    if (!Number.isInteger(departmentId) || departmentId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid department ID'
        });
    }

    if (!Number.isInteger(departmentWorkTypeId) || departmentWorkTypeId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid work type ID'
        });
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Duration must be greater than zero'
        });
    }

    let isLeaveOrPermission = false;

    try {
        const [rows] = await db.query(
            `
            SELECT wt.work_type_name AS work_type_name
            FROM department_work_types dwt
            INNER JOIN work_types wt
                ON wt.id = dwt.work_type_id
            WHERE dwt.id = ?
              AND dwt.department_id = ?
            LIMIT 1
            `,
            [
                departmentWorkTypeId,
                departmentId
            ]
        );

        if (!rows.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid work type for this department'
            });
        }

        const workTypeName =
            String(rows[0].work_type_name || '')
                .trim()
                .toLowerCase();

        isLeaveOrPermission =
            workTypeName === 'leave / permission';

    } catch (err) {
        console.error('Failed to validate work type:', err);

        return res.status(500).json({
            success: false,
            message: 'Unable to validate work type'
        });
    }

    let projectId = null;

    if (!isLeaveOrPermission) {
        if (
            project_id === null ||
            project_id === undefined ||
            project_id === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Project is required'
            });
        }

        projectId = Number(project_id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }
    }

    let activityId = null;

    if (!isLeaveOrPermission) {
        if (
            activity_id === null ||
            activity_id === undefined ||
            activity_id === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Activity is required'
            });
        }

        activityId = Number(activity_id);

        if (!Number.isInteger(activityId) || activityId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid activity ID'
            });
        }
    }

    let subActivityId = null;

    if (!isLeaveOrPermission) {
        if (
            sub_activity_id === null ||
            sub_activity_id === undefined ||
            sub_activity_id === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Sub Activity is required'
            });
        }

        subActivityId = Number(sub_activity_id);

        if (!Number.isInteger(subActivityId) || subActivityId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sub activity ID'
            });
        }
    }

    const cleanRemarks =
        typeof remarks === 'string' &&
        remarks.trim() !== ''
            ? remarks.trim()
            : null;

    if (isLeaveOrPermission && !cleanRemarks) {
        return res.status(400).json({
            success: false,
            message: 'Remarks are required for Leave / Permission'
        });
    }

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
        console.error('Failed to create work log:', err);

        return res.status(500).json({
            success: false,
            message:
                err?.sqlMessage ||
                'Please try again later!'
        });
    }
};