const db = require('../../config/db');

const employeesModel = {

    // for the employees and employee's list of admin dashboard

    checkEmployee_id: async (employee_id) => {
        const [rows] = await db.query(
            'SELECT * FROM employees WHERE employee_id = ?',
            [employee_id]
        );
        return rows[0]
    },

    createEmployee: async (employee_id, employee_name, department_id, designation, role, status) => {
        const [result] = await db.query(
            `
            INSERT INTO employees
            (
            employee_id, 
            employee_name, 
            department_id, 
            designation,
            role,
            status 
            ) values (?, ?, ?, ?, ?, ?)
            `,
            [employee_id, employee_name, department_id, designation, role, status]
        );
        return result.insertId;
    },

    getAllEmployees: async (search, page, sort, limit) => {
        const keyword = `%${search}%`

        const offset = (page - 1) * limit

        let orderBy = 'e.created_at DESC'

        if (sort === 'oldest') {
            orderBy = 'e.created_at ASC'
        }

        if (sort === 'employee_asc') {
            orderBy = 'e.employee_name ASC'
        }

        if (sort === 'employee_desc') {
            orderBy = 'e.employee_name DESC'
        }

        const [rows] = await db.query(
            `
            SELECT 
                e.id,
                e.employee_id,
                e.employee_name,
                e.department_id,
                d.department_name AS department_name,
                e.designation,
                e.role,
                e.status,
                e.created_at
            FROM 
                employees e
            LEFT JOIN 
                departments d
            ON 
                e.department_id = d.id
            WHERE 
                (
                    e.employee_id LIKE ?
                    OR e.employee_name LIKE ?
                    OR d.department_name LIKE ?
                    OR e.designation LIKE ?
                )
            ORDER BY 
                ${orderBy}
            LIMIT ?
            OFFSET ?
            `,
            [keyword, keyword, keyword, keyword, limit, offset]
        );

        const [[count]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM 
                employees e
            LEFT JOIN 
                departments d
            ON 
                e.department_id = d.id
            WHERE 
                (
                    e.employee_id LIKE ?
                    OR e.employee_name LIKE ?
                    OR d.department_name LIKE ?
                    OR e.designation LIKE ?
                )
            `,
            [keyword, keyword, keyword, keyword]
        )
        return ({
            rows,
            total: count.total
        })
    },

    getEmployeeById: async (id) => {
        const [rows] = await db.query(
            `
            SELECT 
                e.id,
                e.employee_id,
                e.employee_name,
                e.department_id,
                d.department_name AS department_name,
                e.designation,
                e.role,
                e.status,
                e.created_at
            FROM 
                employees e
            LEFT JOIN 
                departments d
            ON 
                e.department_id = d.id
            WHERE 
                e.id = ?
            `,
            [id]
        );
        return rows[0]
    },

    checkOtherEmployee_id: async (id, employee_id) => {
        const [rows] = await db.query(
            `SELECT * FROM employees WHERE employee_id = ?  AND id <> ?`,
            [employee_id, id]
        );
        return rows[0]
    },

    updateEmployee: async (id, employee_id, employee_name, department_id, designation, role, status) => {
        const [result] = await db.query(
            `
            UPDATE 
                employees
            SET 
                employee_id = ?,
                employee_name = ?,
                department_id = ?,
                designation = ?,
                role = ?,
                status = ?
            WHERE 
                id = ?
            `,
            [employee_id, employee_name, department_id, designation, role, status, id]
        );
        return result.affectedRows;
    },


    // ----------------------------END-----------------------------

    // for the employee enter id of employee's panel

    getSuperVisorDetails: async (employee_id) => {
        const [rows] = await db.query(
            `
            SELECT 
                e.id,
                e.employee_id,
                e.employee_name,
                e.department_id,
                d.department_name AS department_name,
                e.designation,
                e.role,
                e.status,
                e.created_at
            FROM 
                employees e
            LEFT JOIN 
                departments d
            ON 
                e.department_id = d.id
            WHERE 
                e.employee_id = ?
                AND e.role = 'Supervisor'
            `,
            [employee_id]
        );
        return rows[0]
    },

    // get non-supervisor employees for employee selection dropdown

    getNonSupervisorEmployees: async () => {
        const [rows] = await db.query(
            `
            SELECT 
                e.id,
                e.employee_id,
                e.employee_name,
                e.department_id,
                d.department_name AS department_name,
                e.designation,
                e.role,
                e.status
            FROM 
                employees e
            LEFT JOIN 
                departments d
            ON 
                e.department_id = d.id
            WHERE 
                e.role <> 'Supervisor'
                AND e.status = 'Active'
            ORDER BY 
                e.employee_name ASC
            `
        );

        return rows;
    }
}

module.exports = employeesModel;