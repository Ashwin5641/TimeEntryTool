const db = require('../../config/db');

const dashboardModel = {
    getkpi: async () => {
        const [[kpi]] = await db.query(
            `
            SELECT 
                COUNT(DISTINCT wl.employee_id) AS active_employees,
                COUNT(*) AS total_entries,
                COALESCE(SUM(duration_minutes), 0) AS total_minutes,
                COALESCE(SUM(
                            CASE
                                WHEN a.activity_name = 'value added'
                                THEN duration_minutes
                                ELSE 0
                            END
                ), 0) AS value_added_minutes,

                COALESCE(SUM(
                    CASE
                        WHEN a.activity_name = 'value added'
                        THEN duration_minutes
                        ELSE 0
                    END
                ) / NULLIF(SUM(duration_minutes), 0) * 100, 0) AS value_added_percentage,
                
                COALESCE(SUM(
                            CASE 
                                WHEN a.activity_name = 'non value added'
                                THEN duration_minutes
                                ELSE 0
                            END
                ), 0) AS non_value_added_minutes,

                COALESCE(SUM(
                            CASE 
                                WHEN a.activity_name = 'non value added'
                                THEN duration_minutes
                                ELSE 0
                            END
                ) / NULLIF(SUM(duration_minutes), 0) * 100, 0) AS non_value_added_percentage,
                
                COALESCE(SUM(
                            CASE
                                WHEN a.activity_name = 'other'
                                THEN duration_minutes
                                ELSE 0
                            END
                ), 0) AS other_minutes,

                COALESCE(SUM(
                            CASE
                                WHEN a.activity_name = 'other'
                                THEN duration_minutes
                                ELSE 0
                            END
                ) / NULLIF(SUM(duration_minutes), 0) * 100, 0) AS other_percentage
                
                
            FROM work_logs wl
            LEFT JOIN activities a
            ON wl.activity_id = a.id
            LEFT JOIN projects p
            ON wl.project_id = p.id
            WHERE wl.work_date = CURDATE();
            `
        );
        return kpi;
    },

    getTotalActiveProjects: async () => {
        const [[result]] = await db.query(
            `
            SELECT COUNT(*) AS total_active_projects FROM projects WHERE status = 'active';
            `
        );
        return result.total_active_projects;
    },

    getTotalEmployees: async () => {
        const [[result]] = await db.query(
            `
            SELECT COUNT(*) AS total_employees
            FROM employees
            `
        );

        return result.total_employees;
    },

    getHourlyWorkLogs: async () => {

        const [rows] = await db.query(
            `
            SELECT
                HOUR(created_at) AS hour,
                SUM(duration_minutes) AS minutes

            FROM work_logs

            WHERE work_date = CURDATE()

            GROUP BY HOUR(created_at)

            ORDER BY hour;
            `
        );

        return rows;
    },

    getWorkEfficiencyComparison: async () => {
        const [rows] = await db.query(`
            SELECT
                DATE_FORMAT(wl.work_date, '%Y-%m-%d') AS work_date,

                /* TOTAL */
                COALESCE(
                    SUM(wl.duration_minutes),
                    0
                ) AS total_minutes,

                /* VALUE ADDED MINUTES */
                COALESCE(
                    SUM(
                        CASE
                            WHEN LOWER(a.activity_name) = 'value added'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ),
                    0
                ) AS value_added_minutes,

                /* VALUE ADDED PERCENTAGE */
                COALESCE(
                    SUM(
                        CASE
                            WHEN LOWER(a.activity_name) = 'value added'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ) / NULLIF(SUM(wl.duration_minutes), 0) * 100,
                    0
                ) AS value_added_percentage,

                /* NON VALUE ADDED MINUTES */
                COALESCE(
                    SUM(
                        CASE
                            WHEN LOWER(a.activity_name) = 'non value added'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ),
                    0
                ) AS non_value_added_minutes,

                /* NON VALUE ADDED PERCENTAGE */
                COALESCE(
                    SUM(
                        CASE
                            WHEN LOWER(a.activity_name) = 'non value added'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ) / NULLIF(SUM(wl.duration_minutes), 0) * 100,
                    0
                ) AS non_value_added_percentage,

                /* OTHER MINUTES */
                COALESCE(
                    SUM(
                        CASE
                            WHEN LOWER(a.activity_name) = 'other'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ),
                    0
                ) AS other_minutes,

                /* OTHER PERCENTAGE */
                COALESCE(
                    SUM(
                        CASE
                            WHEN LOWER(a.activity_name) = 'other'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ) / NULLIF(SUM(wl.duration_minutes), 0) * 100,
                    0
                ) AS other_percentage

            FROM work_logs wl

            LEFT JOIN activities a
                ON wl.activity_id = a.id

            WHERE wl.work_date IN (
                CURDATE(),
                DATE_SUB(CURDATE(), INTERVAL 1 DAY)
            )

            GROUP BY wl.work_date

            ORDER BY wl.work_date;
        `);

        return rows;
    },

    getDepartmentProductivity: async () => {
        const [rows] = await db.query(`
            SELECT
                d.department_name,

                COALESCE(
                    SUM(
                        CASE
                            WHEN a.activity_name = 'value added'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ) / NULLIF(SUM(wl.duration_minutes), 0) * 100,
                    0
                ) AS productivity_percentage,

                COALESCE(
                    SUM(
                        CASE
                            WHEN a.activity_name = 'non value added'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ) / NULLIF(SUM(wl.duration_minutes), 0) * 100,
                    0
                ) AS non_value_added_percentage,

                COALESCE(
                    SUM(
                        CASE
                            WHEN a.activity_name = 'other'
                            THEN wl.duration_minutes
                            ELSE 0
                        END
                    ) / NULLIF(SUM(wl.duration_minutes), 0) * 100,
                    0
                ) AS other_percentage

            FROM work_logs wl

            INNER JOIN departments d
                ON wl.department_id = d.id

            LEFT JOIN activities a
                ON wl.activity_id = a.id

            WHERE wl.work_date = CURDATE()

            GROUP BY d.id, d.department_name

            ORDER BY productivity_percentage DESC;
        `);

        return rows;
    },

    getProjectWiseHours: async () => {
        const [rows] = await db.query(
            `
            SELECT
                p.id AS project_id,
                p.project_name,

                COALESCE(
                    SUM(wl.duration_minutes),
                    0
                ) AS total_minutes

            FROM work_logs wl

            INNER JOIN projects p
                ON wl.project_id = p.id

            WHERE
                p.status = 'active'

            GROUP BY
                p.id,
                p.project_name

            ORDER BY
                total_minutes DESC;
            `
        );

        return rows;
    },
}

module.exports = dashboardModel;