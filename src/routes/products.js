import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import { uploader } from '../../utils.js';



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg/webp') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos JPG y webp'));
    }
  }
});

const products = Router();

const getProductsFromFile = () => {
  try {
    const data = fs.readFileSync('products.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveProductsToFile = (productos) => {
  fs.writeFileSync('products.json', JSON.stringify(productos, null, 2), 'utf-8');
};

products.post("/", uploader.single('file'), (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send({ error: "Todos los campos son obligatorios" });
  }

  const productos = getProductsFromFile();

  const producto = {
    id: productos.length + 1,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: req.files ? req.files.map(file => file.filename) : []
};

productos.push(producto);
saveProductsToFile(productos);

res.send({ resultado: "ok", mensaje: "El producto se agregó correctamente", producto });
});


products.delete("/:id", (req, res) => {
    const { id } = req.params;
    const productos = getProductsFromFile();
    const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
  
    if (productoIndex === -1) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }
  
    productos.splice(productoIndex, 1); 
    saveProductsToFile(productos);
  
    res.send({ resultado: "ok", mensaje: "Producto eliminado correctamente" });
  });
  
  
  products.put("/:id", uploader.single('file'), (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, stock, category } = req.body;
  
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send({ error: "Todos los campos son obligatorios" });
    }
  
    const productos = getProductsFromFile();
    const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
  
    if (productoIndex === -1) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }
  
    const updatedProducto = {
      id: parseInt(id),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: req.files ? req.files.map(file => file.filename) : productos[productoIndex].thumbnails 
    };
  
    productos[productoIndex] = updatedProducto; 
    saveProductsToFile(productos);
  
    res.send({ resultado: "ok", mensaje: "Producto actualizado correctamente", producto: updatedProducto });
  });
  
export default products;

