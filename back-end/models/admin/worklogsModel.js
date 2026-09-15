const db = require('../../config/db');

const workLogsModel = {
    getAllWorkLogs: async (search, page, limit, sort, workDate) => {

        const keyword = `%${search}%`;

        const offset = (page - 1) * limit;

        let orderBy = `wl.created_at DESC`;

        if (sort === 'oldest') {
            orderBy = 'wl.created_at ASC';
        }

        if (sort === 'employee_asc') {
            orderBy = 'e.employee_name ASC';
        }

        if (sort === 'employee_desc') {
            orderBy = 'e.employee_name DESC';
        }

        if (sort === 'department_asc') {
            orderBy = 'd.department_name ASC';
        }

        if (sort === 'department_desc') {
            orderBy = 'd.department_name DESC';
        }

        if (sort === 'project_asc') {
            orderBy = 'p.project_name ASC';
        }

        if (sort === 'project_desc') {
            orderBy = 'p.project_name DESC';
        }

        const whereConditions = [
            `
            (
                e.employee_name LIKE ?
                OR d.department_name LIKE ?
                OR p.project_name LIKE ?
                OR a.activity_name LIKE ?
                OR sa.sub_activity_name LIKE ?
                OR wt.work_type_name LIKE ?
            )
            `
        ]

        const whereParams = [
            keyword,
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        ];

        // Single date filter
        if (workDate) {
            whereConditions.push(`
                DATE(wl.work_date) = ?
            `);

            whereParams.push(workDate);
        }

        const whereClause = `
            WHERE ${whereConditions.join(' AND ')}
        `;

        const [rows] = await db.query(
            `
            SELECT 
                wl.id,
                wl.employee_id,
                e.employee_name,

                wl.entered_by_employee_id,
                entered_by.employee_name AS entered_by_employee_name,

                wl.department_id,
                d.department_name,

                wl.project_id,
                p.project_name,

                wl.activity_id,
                a.activity_name,

                wl.sub_activity_id,
                sa.sub_activity_name,

                wl.department_work_type_id,
                wt.work_type_name,

                wl.work_date,
                wl.duration_minutes,
                wl.remarks,
                wl.created_at

            FROM work_logs wl

            LEFT JOIN employees e
                ON wl.employee_id = e.id

            LEFT JOIN employees entered_by
                ON wl.entered_by_employee_id = entered_by.id

            LEFT JOIN departments d
                ON wl.department_id = d.id

            LEFT JOIN projects p
                ON wl.project_id = p.id

            LEFT JOIN activities a
                ON wl.activity_id = a.id

            LEFT JOIN sub_activities sa
                ON wl.sub_activity_id = sa.id

            LEFT JOIN department_work_types dwt
                ON wl.department_work_type_id = dwt.id

            LEFT JOIN work_types wt
                ON dwt.work_type_id = wt.id

            ${whereClause}

            ORDER BY ${orderBy}

            LIMIT ?
            OFFSET ?
            `,
            [
                 ...whereParams,
                limit,
                offset
            ]
        );

        const [[count]] = await db.query(
            `
            SELECT COUNT(*) AS total

            FROM work_logs wl

            LEFT JOIN employees e
                ON wl.employee_id = e.id
            
            LEFT JOIN employees entered_by
                ON wl.entered_by_employee_id = entered_by.id

            LEFT JOIN departments d
                ON wl.department_id = d.id

            LEFT JOIN projects p
                ON wl.project_id = p.id

            LEFT JOIN activities a
                ON wl.activity_id = a.id

            LEFT JOIN sub_activities sa
                ON wl.sub_activity_id = sa.id

            LEFT JOIN department_work_types dwt
                ON wl.department_work_type_id = dwt.id

            LEFT JOIN work_types wt
                ON dwt.work_type_id = wt.id

            ${whereClause}
            `,
            [
                ...whereParams,
            ]
        );

        return {
            rows,
            total: count.total
        };
    },

    getTodaySummary: async (employee_id) => {
    const [rows] = await db.query(
        `
        SELECT
        COUNT(*) AS total_logs,
        COALESCE(SUM(duration_minutes), 0) AS total_minutes
        FROM work_logs
        WHERE employee_id = ?
        AND DATE(work_date) = CURDATE()
        `,
            [employee_id]
        );

        const totalLogs = Number(rows[0]?.total_logs || 0);
        const totalMinutes = Number(rows[0]?.total_minutes || 0);

        const standardWorkMinutes = 8 * 60;

        const remainingMinutes = Math.max(
            standardWorkMinutes - totalMinutes,
            0
        );

        return {
            totalLogs,
            totalMinutes,
            remainingMinutes
        };
    },

    getEmployeesNotLogged: async (workDate) => {

        if (!workDate) {
            throw new Error('Work date is required');
        }

        const [rows] = await db.query(
            `
            SELECT
                e.id,
                e.employee_id,
                e.employee_name,
                e.department_id,
                d.department_name

            FROM employees e

            LEFT JOIN departments d
                ON e.department_id = d.id

            LEFT JOIN work_logs wl
                ON wl.employee_id = e.id
                AND DATE(wl.work_date) = ?

            WHERE
                e.status = 'Active'
                AND wl.id IS NULL

            ORDER BY
                d.department_name ASC,
                e.employee_name ASC
            `,
            [workDate]
        );

        return rows;
    },

    downloadWorkLogs: async (
        search,
        sort,
        workDate
    ) => {

        const keyword =
            `%${search || ''}%`;

        let orderBy =
            'wl.created_at DESC';

        switch (sort) {

            case 'oldest':
                orderBy =
                    'wl.created_at ASC';
                break;

            case 'employee_asc':
                orderBy =
                    'e.employee_name ASC';
                break;

            case 'employee_desc':
                orderBy =
                    'e.employee_name DESC';
                break;

            case 'department_asc':
                orderBy =
                    'd.department_name ASC';
                break;

            case 'department_desc':
                orderBy =
                    'd.department_name DESC';
                break;

            case 'project_asc':
                orderBy =
                    'p.project_name ASC';
                break;

            case 'project_desc':
                orderBy =
                    'p.project_name DESC';
                break;

            default:
                orderBy =
                    'wl.created_at DESC';
        }

        let sql = `
            SELECT

                wl.id,

                wl.employee_id,

                e.employee_name
                    AS employee_name,

                wl.entered_by_employee_id,

                entered_by.employee_name
                    AS entered_by_employee_name,

                wl.department_id,

                d.department_name
                    AS department_name,

                wl.project_id,

                p.project_name
                    AS project_name,

                wl.activity_id,

                a.activity_name
                    AS activity_name,

                wl.sub_activity_id,

                sa.sub_activity_name
                    AS sub_activity_name,

                wl.department_work_type_id,

                wt.work_type_name
                    AS work_type_name,

                DATE_FORMAT(
                    wl.work_date,
                    '%Y-%m-%d'
                ) AS work_date,

                wl.duration_minutes,

                wl.remarks,

                wl.created_at

            FROM work_logs wl

            LEFT JOIN employees e
                ON wl.employee_id = e.id

            LEFT JOIN employees entered_by
                ON wl.entered_by_employee_id = entered_by.id

            LEFT JOIN departments d
                ON wl.department_id = d.id

            LEFT JOIN projects p
                ON wl.project_id = p.id

            LEFT JOIN activities a
                ON wl.activity_id = a.id

            LEFT JOIN sub_activities sa
                ON wl.sub_activity_id = sa.id

            LEFT JOIN department_work_types dwt
                ON wl.department_work_type_id = dwt.id

            LEFT JOIN work_types wt
                ON dwt.work_type_id = wt.id

            WHERE
            (
                e.employee_name LIKE ?
                OR d.department_name LIKE ?
                OR p.project_name LIKE ?
                OR a.activity_name LIKE ?
                OR sa.sub_activity_name LIKE ?
                OR wt.work_type_name LIKE ?
            )
        `;

        const params = [
            keyword,
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        ];

        if (workDate) {

            sql += `
                AND DATE(wl.work_date) = ?
            `;

            params.push(workDate);
        }

        sql += `
            ORDER BY ${orderBy}
        `;

        const [rows] =
            await db.query(
                sql,
                params
            );

        return rows;
    },

};

module.exports = workLogsModel;