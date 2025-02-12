import express from 'express';
import products from './src/routes/products.js';
import carts from './src/routes/carts.js';
import viewsRouter from './src/routes/viewRoutes.js'; 
import { engine } from "express-handlebars"; 
import path from "path";
import __dirname from './utils.js';
import { uploader } from './utils.js'; 
import { Server as socketIo } from 'socket.io';
import http from 'http';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/src/views"));

app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/", viewsRouter);

app.use(express.static(path.join(__dirname, "/public")));

app.post('/upload', uploader.single('image'), (req, res) => {
  res.send({ message: 'Archivo subido correctamente', file: req.file });
});

const server = http.createServer(app);
const socketServer = new socketIo(server);

socketServer.on('connection', socket => {
  
  socket.emit("realtimeproducts", getProductsFromFile());

  socket.on("nuevoProducto", data => {
    const { title, description, code, price, stock, category, thumbnails } = data;

    if (!title || !description || !code || !price || !stock || !category) {
      return socket.emit("error", { error: "Todos los campos son obligatorios" });
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
      thumbnails: thumbnails || []  
    };

    productos.push(producto);
    saveProductsToFile(productos);  

    socket.emit("realtimeproducts", productos);
    socket.broadcast.emit("realtimeproducts", productos);  
  });
});

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

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
