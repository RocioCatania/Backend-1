import { Router } from "express";
import CartManager from "../classes/cartManager.js";

const carts = Router();
const CM = new CartManager();

carts.get("/", async (req, res) => {
    const carts = await CM.getCarts();
    res.send(carts);
})
carts.post("/", async (req, res) => {
   await CM.createCart();
    res.send({"estado":"OK", "mensaje":"El carrito se creó correctamente!"});
})
carts.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCartById(cid);
    
    res.send(cart);
})
carts.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await CM.addCartProduct(cid, pid);
    res.send({"estado":"OK", "mensaje":"Se agregó el Producto al Carrito!"});
})

export default carts;