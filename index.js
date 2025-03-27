import express from "express";
import carts from "./src/router/carts.js"
import products from "./src/router/products.js";
import { Server } from "socket.io"; 
import __dirname from "./utils.js";
import viewsRouter from "./src/router/viewRoutes.js";
import handlebars from 'express-handlebars';
import ProductManager from "./src/classes/productManager.js";
import mongoose from "mongoose";


const app = express();
const port = 8080;
const httpServer = app.listen(port, "0.0.0.0",() => {
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

mongoose.connect("mongodb+srv://Rocio:Rocio36404752.@cluster0.a02ls.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

const PM = new ProductManager();


socketServer.on("connection", async socket => {
  const products = await PM.getProducts();
  socket.emit("realtimeproducts", products);

  socket.on("nuevoProducto", async data => {

      const product = {title:data.title, description:data.description, code:data.code, price:data.price, category:data.category, thumbnails:[data.image]};
      await PM.addProduct(product);
      console.log("Se agregó un nuevo Producto!");
      const products = await PM.getProducts();
      socket.emit("realtimeproducts", products);
  })

  socket.on("eliminarProducto", async data => {
      await PM.deleteProduct(data);
      console.log("Se eliminó un Producto!");
      const products =await PM.getProducts();
      socket.emit("realtimeproducts", products);
  })
})

