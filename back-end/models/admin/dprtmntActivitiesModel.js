const db = require('../../config/db');
const { checkExisting } = require('./subActivitiesModel');

const dprtmntActivitiesModel = {
    checkExisting: async (department_id, activity_id) => {
        const [rows] = await db.query(
            `
            SELECT 
                department_id, 
                activity_id
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
    
    createDprtmntActivity: async (departmnet_id, activity_id, status) => {
        const [result] = await db.query(
            `
            INSERT INTO department_activities
            (department_id, activity_id, status)
            VALUES (?, ?, ?)
            `,
            [departmnet_id, activity_id, status]
        );
        return result.insertId
    },

    getAllDprtmntActivities: async (search, page, limit, sort) => {

        const keyword = `%${search}%`

        const offset = (page - 1) * limit

        let orderBy = `created_at DESC`

        if (sort === 'oldest') {
            orderBy = 'created_at ASC'
        }

        if (sort === 'activity_asc') {
            orderBy = 'activity_name ASC'
        }

        if (sort === 'activity_desc') {
            orderBy = 'activity_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT
                da.id,
                da.department_id,
                d.department_name,
                da.activity_id,
                a.activity_name,
                da.status,
                da.created_at
            FROM 
                department_activities da
            LEFT JOIN 
                departments d
            ON 
                da.department_id = d.id
            LEFT JOIN 
                activities a
            ON 
                da.activity_id = a.id
            WHERE
                department_name LIKE ?
                OR activity_name LIKE ?
            ORDER BY
                ${orderBy}
            LIMIT ?
            OFFSET ?
            `,
            [keyword, keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT
                COUNT(*) AS total
            FROM 
                department_activities da
            LEFT JOIN 
                departments d
            ON 
                da.department_id = d.id
            LEFT JOIN 
                activities a
            ON 
                da.activity_id = a.id
            WHERE
                department_name LIKE ?
                OR activity_name LIKE ?
            `,
            [keyword, keyword]
        )

        return ({
            rows,
            total: count.total
        });
    },

    checkOtherExistingById: async (id, department_id, activity_id) => {
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
                AND
                id <> ?
            `,
            [department_id, activity_id, id]
        );
        return rows[0]
    },

    updateDprtmntActivity: async (id, department_id, activity_id, status) => {
        const [result] = await db.query(
           `
            UPDATE 
                department_activities
            SET
                department_id = ?,
                activity_id = ?
            WHERE 
                id = ?
           `,
           [department_id, activity_id, status, id]
        );
        return result.affectedRows;
    },

    getActivityByDprtmntId: async (department_id) => {
        const [rows] = await db.query(
            `
            SELECT
                da.activity_id,
                a.activity_name
            FROM 
                department_activities da
            LEFT JOIN 
                activities a
            ON 
                da.activity_id = a.id
            WHERE
                da.department_id = ?
            `,
            [department_id]
        );
        return rows;
    },

    getActivityByDprtmntIdForEmployee: async (department_id) => {

        const [rows] = await db.query(
            `
            SELECT
                da.id AS department_activity_id,
                da.department_id,
                da.activity_id,
                a.activity_name
            FROM department_activities da
            INNER JOIN activities a
                ON da.activity_id = a.id
            WHERE
                da.department_id = ?
                AND da.status = 'Active'
                AND a.status = 'Active'
            ORDER BY
                a.activity_name ASC
            `,
            [department_id]
        );

        return rows;
    }
    
}

module.exports = dprtmntActivitiesModel;