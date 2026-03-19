const bcrypt = require('bcrypt');
const User = require('../models/User');

const userController = {
    // Mostrar formulario de registro
    register(req, res) {
        res.render('users/register', { 
            title: 'Registro' 
        });
    },

    // Procesar registro
    async createUser(req, res) {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashedPassword });
            req.session.user = user;
            res.redirect('/');
        } catch (error) {
            console.error('Error creating user:', error);
            res.render('users/register', { 
                title: 'Registro',
                error: 'Error al crear el usuario' 
            });
        }
    },

    // Mostrar formulario de inicio de sesión
    login(req, res) {
        res.render('users/login', { 
            title: 'Iniciar Sesión' 
        });
    },

    // Procesar inicio de sesión
    async authenticateUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.render('users/login', { 
                    title: 'Iniciar Sesión',
                    error: 'Correo o contraseña incorrectos' 
                });
            }
            req.session.user = user;
            res.redirect('/');
        } catch (error) {
            console.error('Error authenticating user:', error);
            res.render('users/login', { 
                title: 'Iniciar Sesión',
                error: 'Error al iniciar sesión' 
            });
        }
    },

    // Cerrar sesión
    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
};

module.exports = userController;
