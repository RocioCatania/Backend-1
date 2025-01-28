import { Router } from 'express';

const carts = Router();

let carritos = []; 

const getId = () => {
return carritos.length + 1;
};


carts.get("/:cid", (req, res) => {
    const { cid } = req.params; 
    const carrito = carritos.find(item => item.id == cid); 

if (!carrito) {
    return res.status(404).send({ error: `El carrito con ID ${cid} no existe.` });
}

    res.send({ productos: carrito.products }); 
});


carts.post("/", (req, res) => {
const carrito = {
    id: getId(), 
    products: [] 
};

    carritos.push(carrito); 
res.status(201).send({ mensaje: "Carrito creado exitosamente", carrito });
});


carts.post("/:cid/product/:pid", (req, res) => {
const { cid, pid } = req.params; 

const carrito = carritos.find((item) => item.id == cid);

if (!carrito) {
    return res.status(404).send({ error: `El carrito con ID ${cid} no existe.` });
}

const productoExistente = carrito.products.find(
    (item) => item.product == pid
);

if (productoExistente) {
    productoExistente.quantity += 1;
} else {
    carrito.products.push({ product: pid, quantity: 1 });
}

res
    .status(200)
    .send({ mensaje: `Producto ${pid} agregado al carrito ${cid}.`, carrito });
});

export default carts;
