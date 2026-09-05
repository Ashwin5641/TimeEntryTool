const db = require('../../config/db');

const empFillDetailsModel = {

    createWorkLog: async (
        employee_id,
        entered_by_employee_id,
        department_id,
        project_id,
        activity_id,
        sub_activity_id,
        department_work_type_id,
        duration_minutes,
        remarks
    ) => {

        const [result] = await db.query(
            `
            INSERT INTO work_logs
            (
                employee_id,
                entered_by_employee_id,
                department_id,
                project_id,
                activity_id,
                sub_activity_id,
                department_work_type_id,
                duration_minutes,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                employee_id,
                entered_by_employee_id,
                department_id,
                project_id,
                activity_id,
                sub_activity_id,
                department_work_type_id,
                duration_minutes,
                remarks
            ]
        );

        return result.insertId;
    }

};

module.exports = empFillDetailsModel;