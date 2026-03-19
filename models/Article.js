const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

class Article {
    static async getAll() {
        try {
            const result = await pool.query('SELECT * FROM revista ORDER BY created_at DESC');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query('SELECT * FROM revista WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(articleData) {
        const { title, content, image_url, user_id, user_name, user_email, user_password } = articleData;
        try {
            const result = await pool.query(
                'INSERT INTO revista (title, content, image_url, user_id, user_name, user_email, user_password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [title, content, image_url, user_id, user_name, user_email, user_password]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, articleData) {
        const { title, content, image_url } = articleData;
        try {
            const result = await pool.query(
                'UPDATE revista SET title = $1, content = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
                [title, content, image_url, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM revista WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Article;

