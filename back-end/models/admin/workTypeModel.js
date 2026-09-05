const db = require('../../config/db');

const workTypeModel = {

    checkExisting: async (work_type_name) => {
        const [rows] = await db.query(
            `
            SELECT
                id,
                work_type_name
            FROM
                work_types
            WHERE 
                work_type_name = ?
            `,
            [work_type_name]
        );
        return rows[0]
    },

    createWorkType: async (work_type_name, status) => {
        const [result] = await db.query(
            `
            INSERT INTO work_types
            (work_type_name, status)
            VALUES (?, ?)
            `,
            [work_type_name, status]
        );
        return result.insertId;
    },

    getAllWorkTypes: async (search, page, limit, sort) => {

        const keyword = `%${search}%`

        const offset = (page - 1) * limit

        let orderBy = 'created_at DESC'

        if (sort === 'oldest') {
            orderBy = 'created_at ASC'
        }

        if (sort === 'workType_asc') {
            orderBy = 'work_type_name ASC'
        }

        if (sort === 'workType_desc') {
            orderBy = 'work_type_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT * FROM work_types
            WHERE 
                work_type_name LIKE ?
            ORDER BY
                ${orderBy}
            LIMIT ?
            OFFSET ?
            `,
            [keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT 
                COUNT(*) AS total
            FROM 
                work_types
            WHERE 
                work_type_name LIKE ?
            `,
            [keyword]
        )

        return ({
            rows,
            total: count.total
        });
    },

    checkOtherExisting: async (id, work_type_name) => {
        const [rows] = await db.query(
            `
            SELECT 
                id,
                work_type_name
            FROM 
                work_types
            WHERE
                work_type_name = ?
                AND id <> ?
            `,
            [work_type_name, id]
        );
        return rows[0]
    },

    updateWorkType: async (id, work_type_name, status) => {
        const [result] = await db.query(
            `
            UPDATE
                work_types
            SET
                work_type_name = ?,
                status = ?
            WHERE 
                id = ?
            `,
            [work_type_name, status, id]
        );
        return result.affectedRows;
    },

    getWorkTypeNameAndId: async () => {
        const [rows] = await db.query(
            `
            SELECT 
                id, work_type_name 
            FROM
                work_types
            `,
        );
        return rows;
    },


}

module.exports = workTypeModel;