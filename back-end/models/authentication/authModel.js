const db = require('../../config/db');

const authModel = {
    findByEmail: async (email) => {
        const [rows] = await db.query(
            `
            SELECT * FROM users WHERE email = ?
            `,
            [email]
        );
        return rows[0]
    },

    findById: async (id) => {
        const [rows] = await db.query(
            `
            SELECT * FROM users WHERE id = ?
            `,
            [id]
        );

        return rows[0]
    }
}

module.exports = authModel;