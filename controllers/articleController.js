const pool = require('../config/database');

// Obtener todos los artículos
const getAllArticles = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM revista ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener artículo por ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM revista WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nuevo artículo
const createArticle = async (req, res) => {
  try {
    const { title, content, image_url, user_id, user_name, user_email, user_password } = req.body;
    
    const result = await pool.query(
      `INSERT INTO revista (title, content, image_url, user_id, user_name, user_email, user_password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, content, image_url, user_id, user_name, user_email, user_password]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear artículo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar artículo
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;
    
    const result = await pool.query(
      `UPDATE revista SET title = $1, content = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 RETURNING *`,
      [title, content, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar artículo
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM revista WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Agregar comentario a un artículo
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, author_email, content } = req.body;
    
    // Verificar que el artículo existe
    const articleCheck = await pool.query('SELECT id FROM revista WHERE id = $1', [id]);
    if (articleCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    const result = await pool.query(
      `INSERT INTO comments (article_id, author_name, author_email, content) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, author_name, author_email, content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener comentarios de un artículo
const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  addComment,
  getComments
};

