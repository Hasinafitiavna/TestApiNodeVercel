import { createConnection } from 'typeorm';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import userRoutes from './controller/Test';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import { messageRoutes } from './controller/MessageTestController'; // Importez la fonction messageRoutes

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez le middleware CORS pour permettre les requêtes depuis votre client React
const allowedOrigins = ['https://message-front.vercel.app', 'http://localhost:3000','https://a245-41-188-46-8.ngrok-free.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

        const port = 5000;
        // Utilisation du routeur pour les routes utilisateur
        // app.use('/utilisateur', userRoutes);

        // Utilisation du routeur pour les routes de message
        // const messageRouter = messageRoutes(io);
        // app.use('/message', messageRouter);
        app.get('/', (req, res) => {
            res.send('Hey this is my API running 🥳')
          })

        app.listen(port, () => {
            console.log(`Serveur en cours d'exécution sur le port ${port}`);
        });

        app.use("/test",userRoutes)


module.exports = app