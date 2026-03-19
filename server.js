require('dotenv').config();

const express = require('express');
const path = require('path');
const articleRoutes = require('./routes/articles');

const app = express();
const port = process.env.PORT || 3001;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/articles', articleRoutes);
app.use('/api', articleRoutes); // Ojo: Esta ruta también apunta a articleRoutes, puede generar conflictos si hay rutas '/' en ambos. Considera un prefijo diferente para la API si son cosas distintas.

app.get('/', (req, res) => {
    res.redirect('/articles');
});

// ¡Aquí está la corrección!
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

