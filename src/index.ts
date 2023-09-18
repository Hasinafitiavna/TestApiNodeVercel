import express from 'express';
import { createConnection } from 'typeorm';
import { Server } from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';

// Importez ici les routes de vos contrôleurs
import { messageRoutes } from './controller/MessageTestController';
import testRoutes from './controller/Test';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez le middleware CORS pour permettre les requêtes depuis votre client React
const allowedOrigins = ['https://message-front.vercel.app', 'http://localhost:3000', 'https://a245-41-188-46-8.ngrok-free.app'];

app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

const port = 5000;

const server = http.createServer(app);

// Créez une instance de Socket.io et passez le serveur HTTP
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

// Gérez les connexions Socket.io
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('sendMessage', (message) => {
        // Enregistrez le message dans la base de données si nécessaire
        // Puis émettez le message à tous les clients connectés
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Utilisation des routes de vos contrôleurs
app.use('/message', messageRoutes(io));
app.use('/test', testRoutes);

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳');
});

// Connexion à la base de données (une seule fois au démarrage de l'application)
// createConnection()
//     .then(() => {
//         server.listen(port, () => {
//             console.log(`Serveur en cours d'exécution sur le port ${port}`);
//         });
//     })
//     .catch((error) => {
//         console.error('Erreur de connexion à la base de données : ', error);
//     });
