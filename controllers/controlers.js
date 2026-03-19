const Article = require('../models/Article');

const articleController = {
    // Mostrar todos los artículos
    async index(req, res) {
        try {
            const articles = await Article.findAll();
            res.render('articles/index', { 
                title: 'Artículos',
                articles: articles 
            });
        } catch (error) {
            console.error('Error fetching articles:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar los artículos' 
            });
        }
    },

    // Mostrar formulario para crear artículo
    async create(req, res) {
        res.render('articles/create', { 
            title: 'Crear Artículo' 
        });
    },

    // Guardar nuevo artículo
    async store(req, res) {
        try {
            const newArticle = await Article.create(req.body);
            res.redirect('/articles');
        } catch (error) {
            console.error('Error creating article:', error);
            res.status(500).render('articles/create', { 
                title: 'Crear Artículo',
                error: 'Error al crear el artículo' 
            });
        }
    },

    // Mostrar un artículo específico
    async show(req, res) {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) {
                return res.status(404).render('error', { 
                    message: 'Artículo no encontrado' 
                });
            }
            res.render('articles/show', { 
                title: article.title,
                article: article 
            });
        } catch (error) {
            console.error('Error fetching article:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el artículo' 
            });
        }
    },

    // Mostrar formulario para editar
    async edit(req, res) {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) {
                return res.status(404).render('error', { 
                    message: 'Artículo no encontrado' 
                });
            }
            res.render('articles/edit', { 
                title: 'Editar Artículo',
                article: article 
            });
        } catch (error) {
            console.error('Error fetching article:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el artículo' 
            });
        }
    },

    // Actualizar artículo
    async update(req, res) {
        try {
            const updatedArticle = await Article.update(req.params.id, req.body);
            if (!updatedArticle) {
                return res.status(404).render('error', { 
                    message: 'Artículo no encontrado' 
                });
            }
            res.redirect(`/articles/${req.params.id}`);
        } catch (error) {
            console.error('Error updating article:', error);
            res.status(500).render('articles/edit', { 
                title: 'Editar Artículo',
                article: req.body,
                error: 'Error al actualizar el artículo' 
            });
        }
    },

    // Eliminar artículo
    async destroy(req, res) {
        try {
            const deletedArticle = await Article.delete(req.params.id);
            if (!deletedArticle) {
                return res.status(404).render('error', { 
                    message: 'Artículo no encontrado' 
                });
