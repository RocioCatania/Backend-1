import { Router } from 'express';

const products= Router();



let productos= [];

const getId= () =>{
    return productos.length +1;
}

products.get("/", (req,res)=>{
    res.send(productos);
})

products.get("/:pid", (req,res)=>{
    const {pid}=req.params;
    const producto= productos.find(item=> item.id==pid)

    if (!producto) {
        return res.status(400).send({ error: "La lista de productos no está disponible" });
    }
    

    res.send(producto);
});

products.post("/", (req,res) => {
    const {title,description,code,price,status,stock,category,thumbnails}= req.body;



    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send({ error: "Todos los campos son obligatorios" });
        return false;
    }

    const producto= {
        id: getId(),
        title,
        description,
        code,
        price,
        status:true,
        stock,
        category,
        thumbnails:[]
    };
    productos.push(producto);
    res.send({resultado:"ok", mensaje: "el producto se agrego correctamente"})
})


products.put("/:pid", (req,res)=>{
    const {pid}=req.params;
    const producto= productos.find(item=> item.id==pid)
    const {title,description,code,price,stock,category}= req.body;

    if (!producto) {
    return res.status(400).send({ error: `El producto con el Id:  ${pid} no fue encontrado` });
    
    }

    producto.title = title || producto.title;
    producto.description = description || producto.description;
    producto.code = code || producto.code;
    producto.price = price || producto.price;
    producto.stock = stock || producto.stock;
    producto.category = category || producto.category;

        res.send({resultado:"ok", mensaje: "el producto se modifico correctamente"})

});

products.delete("/:pid", (req,res)=>{
    const {pid}=req.params;
    const producto= productos.find(item=> item.id==pid)

    if (!producto) {
        return res.status(400).send({ error: "el producto buscado no existe" });
    }
        productos= productos.filter(item=> item.id != pid);
        res.send({resultado:"ok", mensaje: "el producto se elimino correctamente"});
    
});

export default products