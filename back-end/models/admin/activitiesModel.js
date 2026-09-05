const db = require('../../config/db');

const activitiesModel = {

    checkActivityName: async (activity_name) => {
        const [rows] = await db.query(
            'SELECT activity_name FROM activities WHERE activity_name = ?',
            [activity_name]
        );
        return rows[0]
    },

    createActivity: async (activity_name, status) => {
        const [result] = await db.query(
            `
            INSERT INTO activities
            (activity_name, status) VALUES (?, ?)
            `,
            [activity_name, status]
        );
        return result.insertId;
    },

    getAllActivities: async (search, page, limit, sort) => {
        const keyword = `%${search}%`

        const offset = (page - 1) * limit;

        let orderBy = 'created_at DESC';

        if (sort === 'oldest') {
            orderBy = 'created_at ASC'
        }

        if (sort === 'activityName_asc') {
            orderBy = 'activity_name ASC'
        }

        if (sort === 'activityName_desc') {
            orderBy = 'activity_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT 
                * 
            FROM 
                activities
            WHERE
                activity_name LIKE ?
            ORDER BY
                ${orderBy}
            LIMIT ?
            OFFSET ?
            `,
            [keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM 
                activities
            WHERE
                activity_name LIKE ?
            `,
            [keyword]
        )

        return ({
            rows,
            total: count.total
        });
    },

    checkOtherActivityNameById: async (id, activity_name) => {
        const [rows] = await db.query(
            'SELECT activity_name FROM activities WHERE activity_name = ? AND id <> ?',
            [activity_name, id]
        );
        return rows[0]
    },

    updateActivity: async (id, activity_name, status) => {
        const [result] = await db.query(
            `
            UPDATE 
                activities
            SET 
                activity_name = ?,
                status = ?
            WHERE
                id = ?
            `,
            [activity_name, status, id]
        );
        return result.affectedRows;
    },

    getActivityNameAndIdStsAct: async () => {
        const [rows] = await db.query(
            `SELECT id, activity_name FROM activities WHERE status = 'Active'`
        );
        return rows;
    }
}

module.exports = activitiesModel;