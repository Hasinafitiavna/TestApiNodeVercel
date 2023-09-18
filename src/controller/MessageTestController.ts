import express, { Request, Response } from "express";
import { createConnection, getRepository } from "typeorm";
import { MessageTest } from "../entity/MessageTest";
import { Server } from "socket.io";

const routerMessage = express.Router();

// Injectez l'instance Socket.io dans le routeur
export function messageRoutes(io: Server) {
    // Route pour récupérer tous les messages
    createConnection()
    .then(() => {
    routerMessage.get("/getAllMessage", async (req: Request, res: Response) => {
        const messageRepository = getRepository(MessageTest);
        const messages = await messageRepository.find();
        return res.json(messages);
    });

    // Route pour ajouter un nouveau message
    routerMessage.post("/addMessage", async (req: Request, res: Response) => {
        const { idutilisateurenvoie, idutilisateurecoie, message } = req.body;
        const newMessage = new MessageTest();
        newMessage.idutilisateurenvoie = idutilisateurenvoie;
        newMessage.idutilisateurecoie = idutilisateurecoie;
        newMessage.message = message;

        const messageRepository = getRepository(MessageTest);

        try {
            // Enregistrez le message dans la base de données
            await messageRepository.save(newMessage);

            // Émettez le message à tous les clients connectés via Socket.io
            io.emit('newMessage', newMessage);

            return res.status(201).json(newMessage);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du message : ', error);
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
        }
    });
    })
    .catch((error) => {
        console.error('Erreur de connexion à la base de données : ', error);
    });
    return routerMessage;
}
