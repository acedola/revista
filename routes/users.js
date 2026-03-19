const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users/register - Mostrar formulario de registro
router.get('/register', userController.register);

// POST /users - Crear nuevo usuario
router.post('/', userController.createUser);

// GET /users/login - Mostrar formulario de inicio de sesión
router.get('/login', userController.login);

// POST /users/login - Autenticar usuario
router.post('/login', userController.authenticateUser);

// GET /users/logout - Cerrar sesión
router.get('/logout', userController.logout);

module.exports = router;
