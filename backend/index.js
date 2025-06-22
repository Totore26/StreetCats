import express from "express"; //import express
import path from "path"; //import path for file paths

import morgan from "morgan"; //middleware for logging requests
import cors from "cors"; //middleware for CORS
import swaggerUI from "swagger-ui-express"; //middleware for swagger UI
import swaggerJSDoc from "swagger-jsdoc"; //middleware for swagger JSDoc
import dotenv from "dotenv"; //middleware for environment variables
import { fileURLToPath } from 'url'; // for __filename and __dirname

//Routes
import { AuthRouter } from './routes/authRouter.js'; 
import { CatSightingRouter } from "./routes/catSightingRouter.js";
import { CommentRouter } from "./routes/commentRouter.js";
import { errorHandler } from './middleware/errorHandling.js' 

dotenv.config(); //read .env file and make it available in process.env

const app = express();
const PORT = process.env.PORT;
const SESSION_COOKIE_AGE = 365 * 24 * 60 * 60 * 1000 ;  // 1 year in milliseconds
//const SESSION_COOKIE_AGE = 10 * 60 * 1000 ;  // 10 minutes in milliseconds

app.use(morgan("dev")); // 'dev' format for morgan logs
app.use(express.json()); // Parses JSON body (available in req.body)
app.use(express.static("public")); // to serve static files from /public
app.use(express.urlencoded({extended: false})); // Parses url-encoded body (available in req.body)


// Configurazione CORS specifica per localhost:4200
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // Permette l'invio di cookie nelle richieste cross-origin
};
app.use(cors(corsOptions)); // CORS middleware to allow requests from a specific origin

//generate OpenAPI spec and show swaggerUI
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'PROGETTO STREETCAT',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*Router.js','./routers/*/*.js'], // files containing annotations
});
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// abilita il rifornimento di file statici nelle cartelle public e uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//routes
app.use(AuthRouter); 
app.use(CatSightingRouter);
app.use(CommentRouter);

app.use(errorHandler); //error handler middleware

app.listen(PORT, () => { console.log(`🎙️ Backend avviato e in ascolto: http://localhost:${PORT} 🎙️`); });