// src/middlewares/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// storage config con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

// verifico che il file caricato è un'immagine altrimenti errore
const fileFilter = (req, res, next) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(res.originalname).toLowerCase());
  const mime = allowedTypes.test(res.mimetype);
  
  if (ext && mime)  
    next(null, true);
  else 
    next({status: 400, message: 'Only images are allowed!'}); // invio un errore bad request
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // la dimensione massima del file è di 10MB
});

export default upload;
