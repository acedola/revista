require('dotenv').config();

const express = require('express');
const path = require('path');
const articleRoutes = require('./routes/articles');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/articles', articleRoutes);
app.use('/api', articleRoutes);

app.get('/', (req, res) => {
    res.redirect('/articles');
});

app.listen
