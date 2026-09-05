const db = require('../../config/db');

const dprtmntWrkTypModel = {

    checkExisting: async (department_id, work_type_id) => {
        const [rows] = await db.query(
            `
            SELECT 
                id
            FROM 
                department_work_types
            WHERE 
                department_id = ?
                AND work_type_id = ?
            `,
            [department_id, work_type_id]
        );
        return rows[0]
    },

    createDprtmntWrkTyp: async (department_id, work_type_id, status) => {
        const [result] = await db.query(
            `
            INSERT INTO department_work_types
            (department_id, work_type_id, status) 
            VALUES (?, ?, ?)
            `,
            [department_id, work_type_id, status]
        );
        return result.insertId
    },

    getAllDprmntWrkTypes: async (search, page, limit, sort) => {

        const keyword = `%${search}%`

        const offset = (page - 1) * limit

        let orderBy = 'dwt.created_at DESC'

        if (sort === 'oldest') {
            orderBy = 'dwt.created_at ASC'
        }

        if (sort === 'workType_asc') {
            orderBy = 'wt.work_type_name ASC'
        }

        if (sort === 'workType_desc') {
            orderBy = 'wt.work_type_name DESC'
        }

        if (sort === 'department_asc') {
            orderBy = 'd.department_name ASC'
        }

        if (sort === 'department_desc') {
            orderBy = 'd.department_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT
                dwt.id,
                dwt.department_id,
                d.department_name,
                dwt.work_type_id,
                wt.work_type_name,
                dwt.status,
                dwt.created_at
            FROM department_work_types dwt
            LEFT JOIN departments d
            ON dwt.department_id = d.id
            LEFT JOIN work_types wt
            ON dwt.work_type_id = wt.id
            WHERE
                (
                    d.department_name LIKE ?
                    OR wt.work_type_name LIKE ?
                )
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
            FROM department_work_types dwt
            LEFT JOIN departments d
            ON dwt.department_id = d.id
            LEFT JOIN work_types wt
            ON dwt.work_type_id = wt.id
            WHERE
                (
                    d.department_name LIKE ?
                    OR wt.work_type_name LIKE ?
                )
            `,
            [keyword, keyword]
        )

        return ({
            rows,
            total: count.total
        });
    },

    checkOtherExisting: async (id, department_id, work_type_id) => {
        const [rows] = await db.query(
            `
            SELECT 
                id
            FROM
                department_work_types
            WHERE
                (
                    department_id = ?
                    AND work_type_id = ?
                )
                AND id <> ?
            `,
            [department_id, work_type_id, id]
        );
        return rows[0]
    },

    updateDprtmntWrkTyp: async (id, department_id, work_type_id, status) => {
        const [result] = await db.query(
            `
            UPDATE
                department_work_types
            SET
                department_id = ?,
                work_type_id = ?,
                status = ?
            WHERE 
                id = ?
            `,
            [department_id, work_type_id, status, id]
        );
        return result.affectedRows;
    },

    getWorkTypesByDepartment: async (department_id) => {
        const [rows] = await db.query(
            `
            SELECT
                dwt.id,
                dwt.department_id,
                dwt.work_type_id,
                wt.work_type_name,
                dwt.status
            FROM department_work_types dwt

            INNER JOIN work_types wt
                ON dwt.work_type_id = wt.id

            WHERE
                dwt.department_id = ?
                AND dwt.status = 'Active'
                AND wt.status = 'Active'

            ORDER BY
                wt.work_type_name ASC
            `,
            [department_id]
        );
    return rows;
    }
}

module.exports = dprtmntWrkTypModel;