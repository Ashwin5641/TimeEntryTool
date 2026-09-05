const db = require('../../config/db');

const departmentsModel = {

    getDprtmntNameAndCode: async (department_name, department_code) => {
        const [rows] = await db.query(
            `SELECT * FROM departments WHERE department_name = ? OR department_code = ?`,
            [department_name, department_code]
        );
        return rows[0]
    },

    checkOtherNameAndCode: async (id, department_name, department_code) => {
        const [rows] = await db.query(
            `SELECT * FROM departments WHERE (department_name = ? OR department_code = ?) AND id <> ?`,
            [department_name, department_code, id]
        );
        return rows[0]
    },

    getDprtmntNameAndIdStsAct: async () => {
        const [rows] = await db.query(
            `SELECT id, department_name, department_code FROM departments WHERE status = 'Active'`
        );
        return rows;
    },

    createDepartment: async (department_name, department_code, status) => {
        const [result] = await db.query(
            'INSERT INTO departments (department_name, department_code, status) VALUES (?, ?, ?)',
            [department_name, department_code, status]
        );
        return result.insertId;
    },

    getAllDepartments: async (search, page, limit, sort) => {
        
        const keyword = `%${search}%`

        const offset = (page - 1) * limit;

        let orderBy = 'created_at DESC';

        if (sort === 'oldest') {
            orderBy = 'created_at ASC'
        }

        if (sort === 'department_asc') {
            orderBy = 'department_name ASC'
        }

        if (sort === 'department_desc') {
            orderBy = 'department_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT 
                * 
            FROM 
                departments
            WHERE 
                department_name LIKE ? 
            OR
                department_code LIKE ?
            ORDER BY
                ${orderBy}
            LIMIT ?
            OFFSET ? 
            `,
            [keyword, keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM 
                departments
            WHERE 
                department_name LIKE ? 
            OR
                department_code LIKE ?
            `,
            [keyword, keyword]
        )
        return ({
            rows,
            total: count.total
        });
    },

    deleteDepartment: async (id) => {
        const [result] = await db.query(
            `DELETE FROM departments WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    },

    updateDepartment: async (id, department_name, department_code, status) => {
        const [result] = await db.query(
            `
            UPDATE 
                departments 
            SET 
                department_name = ?,
                department_code = ?,
                status = ?
            WHERE id = ?
            `,
            [department_name, department_code, status, id]
        );
        return result.affectedRows;
    }
}

module.exports = departmentsModel;