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

const httpServer = app.listen(port, () => {
  console.log("Servidor activo en el puerto " + port);
});


const server = http.createServer(app);

const socketServer = new socketIo(server);

socketServer.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.use('/api/products', products);

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});



socketServer.on ("connection", socket => {


    socket.emit("realtimeproducts", products)
})