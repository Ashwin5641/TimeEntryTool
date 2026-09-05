const db = require('../../config/db');

const subActivitiesModel = {

    // for the sub activities of admin dashboard

    checkExisting: async (department_activity_id, sub_activity) => {
        const [rows] = await db.query(
            `
            SELECT 
                *
            FROM 
                sub_activities
            WHERE 
                department_activity_id = ?
                AND sub_activity_name = ?
            `,
            [department_activity_id, sub_activity]
        );
        return rows[0]
    },

    getDrptmentActivityId: async (department_id, activity_id) => {
        const [rows] = await db.query(
            `
            SELECT 
                id
            FROM 
                department_activities
            WHERE 
                (
                    department_id = ?
                    AND activity_id = ?
                )
            `,
            [department_id, activity_id]
        );
        return rows[0]
    },

    createSubActivity: async (department_activity_id, sub_activity, status) => {
        const [result] = await db.query(
            `
            INSERT INTO sub_activities
            (department_activity_id, sub_activity_name, status)
            VALUES (?, ?, ?)
            `,
            [department_activity_id, sub_activity, status]
        );
        return result.insertId
    },

    getAllSubActivities: async (search, page, limit, sort) => {
        const keyword = `%${search}%`

        const offset = (page - 1) * limit;

        let orderBy = 'sa.created_at DESC'

        if (sort === 'oldest') {
            orderBy = 'sa.created_at ASC'
        }

        if (sort === 'subActivity_asc') {
            orderBy = 'sa.sub_activity_name ASC'
        }

        if (sort === 'subActivity_desc') {
            orderBy = 'sa.sub_activity_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT
                sa.id,
                sa.department_activity_id,
                da.department_id,
                d.department_name,
                da.activity_id,
                a.activity_name,
                sa.sub_activity_name,
                da.status,
                da.created_at
            FROM 
                sub_activities sa
            LEFT JOIN 
                department_activities da
            ON 
                sa.department_activity_id = da.id
            LEFT JOIN 
                departments d
            ON 
                da.department_id = d.id
            LEFT JOIN 
                activities a
            ON 
                da.activity_id = a.id
            WHERE
                (
                    d.department_name LIKE ?
                    OR a.activity_name LIKE ?
                    OR sa.sub_activity_name LIKE ?
                )
            ORDER BY
                ${orderBy}
            LIMIT ?
            OFFSET ?
            `,
            [keyword, keyword, keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT 
                COUNT(*) AS total
            FROM 
                sub_activities sa
            LEFT JOIN 
                department_activities da
            ON 
                sa.department_activity_id = da.id
            LEFT JOIN 
                departments d
            ON 
                da.department_id = d.id
            LEFT JOIN 
                activities a
            ON 
                da.activity_id = a.id
            WHERE
                (
                    d.department_name LIKE ?
                    OR a.activity_name LIKE ?
                    OR sa.sub_activity_name LIKE ?
                ) 
            `,
            [keyword, keyword, keyword]
        )

        return ({
            rows,
            total: count.total
        });
    },

    checkOtherExistingById: async (id, department_activity_id, sub_activity) => {
        const [rows] = await db.query(
            `
            SELECT 
                * 
            FROM
                sub_activities
            WHERE
                (
                department_activity_id = ?
                AND sub_activity_name = ?
                )
                AND
                id <> ?
            `,
            [department_activity_id, sub_activity, id]
        );
        return rows[0]
    },

    updateSubActivity: async (id, department_activity_id, sub_activity, status) => {
        const [result] = await db.query(
            `
            UPDATE
                sub_activities
            SET
                department_activity_id = ?,
                sub_activity_name = ?,
                status = ?
            WHERE
                id = ?
            `,
            [department_activity_id, sub_activity, status, id]
        );
        return result.affectedRows;
    },

    // ------------------------------END--------------------------------

    getSubActivitieNameAndIdStsAct: async (department_id, activity_id) => {
        const [rows] = await db.query(
            `
            SELECT
                sa.id,
                da.department_id,
                da.activity_id,
                a.activity_name,
                sa.sub_activity_name,
                sa.status,
                sa.created_at
            FROM sub_activities sa

            INNER JOIN department_activities da
                ON sa.department_activity_id = da.id

            INNER JOIN activities a
                ON da.activity_id = a.id

            WHERE
                da.department_id = ?
                AND da.activity_id = ?
                AND sa.status = 'Active'
                AND da.status = 'Active'

            ORDER BY
                sa.sub_activity_name ASC
            `,
            [department_id, activity_id]
        );
        return rows;
    }
}

module.exports = subActivitiesModel;