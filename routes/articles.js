const express = require('express');
const router = express.Router();
const { 
  getAllArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  addComment,
   getComments
} = require('../controllers/articleController');

// Obtener todos los artículos
router.get('/', getAllArticles);

// Obtener un artículo específico
router.get('/:id', getArticleById);

// Crear nuevo artículo
router.post('/', createArticle);

// Actualizar artículo
router.put('/:id', updateArticle);

// Eliminar artículo
router.delete('/:id', deleteArticle);

// Agregar comentario a un artículo
router.post('/:id/comments', addComment);

// Obtener comentarios de un artículo
router.get('/:id/comments',  getComments);

module.exports = router;
