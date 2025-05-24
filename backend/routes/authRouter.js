import express from "express";
import { AuthController } from "../controllers/authController.js";

export const AuthRouter = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user and allow access to protected resources
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: The required credentials are username and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usr:
 *                 type: string
 *                 example: CatLover
 *               pwd:
 *                 type: string
 *                 example: p4ssw0rd
 *     responses:
 *       200:
 *         description: User authenticated
 *       401:
 *         description: Invalid credentials
 */
AuthRouter.post("/login", async (req, res) => {

  let isAuthenticated = await AuthController.checkCredentials(req, res);

  if (isAuthenticated) {
    res.json(AuthController.newToken(req.body.usr));
  } else { 
    res.status(401);
    res.json({ error: "🔒 username o password errati, riprova. 🔒" });
  }

});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user and allow access to login
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: The required credentials are username and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usr:
 *                 type: string
 *                 example: CatLover
 *               pwd:
 *                 type: string
 *                 example: p4ssw0rd
 *     responses:
 *       201:
 *         description: User registered
 *       500:
 *         description: Server error
 */
AuthRouter.post("/signup", (req, res) => {

  AuthController.saveUser(req.body)
    .then(() => {
      res.status(201).json({ message: "👤 Utente creato con successo! 👤" });
    })
    .catch((err) => {
      res.status(400).json({ error: "❌ Errore durante la creazione dell'utente ❌" });
    });
    
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the user
 *     description: Logs out the user
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User logged out
 *       401: 
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
AuthRouter.get("/logout" ,(req, res) => {

  const success = AuthController.invalidateToken(req, res);
  res.status(200).json({ message: "🔒 Logout effettuato 🔒" });
  
});