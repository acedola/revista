const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

class Comment {
    static async getByArticleId(articleId) {
        try {
            const result = await pool.query(
                'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC',
                [articleId]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(commentData) {
        const { article_id, author_name, author_email, content } = commentData;
        try {
            const result = await pool.query(
                'INSERT INTO comments (article_id, author_name, author_email, content) VALUES ($1, $2, $3, $4) RETURNING *',
                [article_id, author_name, author_email, content]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM comments WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Comment;
