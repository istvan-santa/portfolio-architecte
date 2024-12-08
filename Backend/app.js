const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocs = yaml.load('swagger.yaml');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
app.use('/images', express.static(path.join(__dirname, 'images')));
const db = require('./models');
db.sequelize.sync().then(() => console.log('db is ready'));
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const validUser = {
    email: "utilisateur@test.com", // Identifiant
    password: "motdepasse123"      // Mot de passe
};

// Route de connexion
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Vérifier si les identifiants sont corrects
    if (email === validUser.email && password === validUser.password) {
        // Générer un token simulé
        const token = "votre_token_simulé"; // Remplace par un vrai token si nécessaire
        res.status(200).json({ token });
    } else {
        // Si les identifiants sont incorrects
        res.status(401).json({ message: "Identifiants incorrects" });
    }
});

module.exports = app;
