import { Router } from "express";
import CartManager from "../classes/cartManager.js";

const carts = Router();
const CM = new CartManager();

carts.get("/", (req, res) => {
    const carts = CM.getCarts();
    res.send(carts);
})
carts.post("/", (req, res) => {
    CM.createCart();
    res.send({"estado":"OK", "mensaje":"El carrito se creó correctamente!"});
})
carts.get("/:cid", (req, res) => {
    const cid = req.params.cid;
    const cart = CM.getCartById(cid);
    
    res.send(cart);
})
carts.post("/:cid/product/:pid", (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    CM.addCartProduct(cid, pid);
    res.send({"estado":"OK", "mensaje":"Se agregó el Producto al Carrito!"});
})

export default carts;