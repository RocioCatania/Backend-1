import { Router } from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const carts = Router();
let carritos = []; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readCartsFromFile = () => {
    const filePath = `${__dirname}/carts.json`;
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        carritos = JSON.parse(fileData);
    }
};

const writeCartsToFile = () => {
    const filePath = `${__dirname}/carts.json`;
    fs.writeFileSync(filePath, JSON.stringify(carritos, null, 2), 'utf-8');
};

readCartsFromFile();

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
    writeCartsToFile(); 
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

    writeCartsToFile();  
    res
        .status(200)
        .send({ mensaje: `Producto ${pid} agregado al carrito ${cid}.`, carrito });
});

export default carts;

