import express from "express";
import carts from "./src/router/carts.js"
import products from "./src/router/products.js";
import { Server } from "socket.io"; 
import __dirname from "./utils.js";
import viewsRouter from "./src/router/viewRoutes.js";
import handlebars from 'express-handlebars';
import ProductManager from "./src/classes/productManager.js";

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log("Servidor activo: " + port);
})
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/src/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/", viewsRouter);
app.use("/api/products", products);
app.use("/api/carts", carts);

const PM = new ProductManager();


socketServer.on("connection", socket => {
  const products = PM.getProducts();
  console.log(products);
  socket.emit("realtimeproducts", products);

  socket.on("nuevoProducto", data => {
      const product = {title:data.title, description:data.description, code:data.code, price:data.price, category:data.category, thumbnails:[data.image]};
      PM.addProduct(product);
      console.log("Se agregó un nuevo Producto!");
      const products = PM.getProducts();
      socket.emit("realtimeproducts", products);
  })

  socket.on("eliminarProducto", data => {
      PM.deleteProduct(data);
      console.log("Se eliminó un Producto!");
      const products = PM.getProducts();
      socket.emit("realtimeproducts", products);
  })
})