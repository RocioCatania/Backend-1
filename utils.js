import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img')); // Carpeta para guardar archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Prefijo de tiempo para evitar duplicados
  }
});

const uploader = multer({ storage });

export default __dirname;
export { uploader };
