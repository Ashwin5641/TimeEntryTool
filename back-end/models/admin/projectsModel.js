const db = require('../../config/db');

const projectsModel = {

    // for projects of admin dashboard

    checkProjectCode: async (project_name) => {
        const [rows] = await db.query(
            'SELECT * FROM projects WHERE project_name = ?',
            [project_name]
        );
        return rows[0]
    },

    createProject: async (project_code, project_name, customer_name, description, status) => {
        const [result] = await db.query(
            `
            INSERT INTO projects 
            (project_code, project_name, customer_name, description, status) 
            VALUES (?, ?, ?, ?, ?)
            `,
            [project_code, project_name, customer_name, description, status]
        );
        return result.insertId;
    },

    getAllProjects: async (search, page, limit, sort) => {

        const keyword = `%${search}%`

        const offset = (page - 1) * limit;

        let orderBy = 'created_at DESC'

        if (sort === 'oldest') {
            orderBy = 'created_at ASC'
        }

        if (sort === 'project_asc') {
            orderBy = 'project_name ASC'
        }

        if (sort === 'project_desc') {
            orderBy = 'project_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT 
                * 
            FROM 
                projects 
            WHERE
                project_code LIKE ?
                OR project_name LIKE ?
                OR customer_name LIKE ?
            ORDER BY
                ${orderBy}
            LIMIT ?
            OFFSET ?
            `,
            [keyword, keyword, keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM 
                projects 
            WHERE
                project_code LIKE ?
                OR project_name LIKE ?
                OR customer_name LIKE ?
            `,
            [keyword, keyword, keyword]
        )

        return ({
            rows,
            total: count.total
        });
    },

    checkProject_codeById: async (id, project_name) => {
        const [rows] = await db.query(
            `SELECT * FROM projects WHERE project_name = ? AND id <> ?`,
            [project_name, id]
        );
        return rows[0]
    },

    updateProject: async (id, project_code, project_name, customer_name, description, status) => {
        const [result] = await db.query(
            `
            UPDATE
                projects
            SET 
                project_code = ?,
                project_name = ?,
                customer_name = ?,
                description = ?,
                status = ?
            WHERE 
                id = ?
            `,
            [project_code, project_name, customer_name, description, status, id]
        );
        return result.affectedRows;
    },

    // ------------------------------END-------------------------

    // for employee fill details of employee panel

    // to get the projects name and id with active status

    getPrjctIdAndNameActSts: async () => {
        const [rows] = await db.query(
            `
            SELECT 
                id,
                project_name,
                customer_name
            FROM 
                projects
            WHERE
                status = 'Active';
            `
        );
        return rows;
    }
}

module.exports = projectsModel;