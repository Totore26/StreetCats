import express from "express";
import { AuthController } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authorizationMiddleware.js";

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
AuthRouter.post("/login", async (req, res, next) => {

  let isAuthenticated = await AuthController.checkCredentials(req, res);

  if (isAuthenticated)
    res.json(AuthController.newToken(req.body.usr));
  else 
    res.status(401).json( { error: "🔒 username o password errati, riprova. 🔒" } );

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
 *       400:
 *         description: User already exists or invalid data
 *       500:
 *         description: Server error
 */
AuthRouter.post("/signup", (req, res, next) => {

  AuthController.saveUser(req.body)
    .then( () => {res.status(201).json({ message: "👤 Utente creato con successo! 👤" });} )
    .catch( err => {next(err);} );
    
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logs out the user
 *     description: Invalidates the user's token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
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
AuthRouter.post("/logout", (req, res, next) => {
  // Estrai il token dall'header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token di autorizzazione mancante o non valido" });
  }
  
  // Estrai il token rimuovendo "Bearer " dall'inizio
  const token = authHeader.substring(7);
  
  // Prepara il token in vari modi possibili
  req.token = token;
  req.auth = { token };
  req.user = { token };
  req.body.token = token;
  
  AuthController.invalidateToken(req, res)
    
});

if (process.env.DEV_MODE === "true") {
  /**
   * @swagger
   * /reset:
   *   get:
   *     summary: Reset database and token blacklist (DevMode only)
   *     description: Resets the application database and invalidates all tokens
   *     tags: [Authentication]
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Database and token blacklist reset successfully
   *       500:
   *         description: Server error during database reset
   */
  AuthRouter.get("/reset", (req, res, next) => {

    AuthController.resetDatabase()
      .then( () => {res.status(200).json({ message: "Database e blacklist dei token resettati con successo!" });} )
      .catch( err => {next(err);} );

  });
}