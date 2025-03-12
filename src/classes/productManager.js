import {productsModels}  from "../models/products.models.js";
import mongoose from "mongoose";


class ProductManager {
    constructor() {
        this.products = []

    }

    async getProducts() {

        return await productsModels.find().lean();
    }


    async getProductById(id) {        
        let product = await productsModels.find({_id:id});
        console.log(products);
        return product ? product : {"error":"No se encontró el Producto!"};
    }
    
    async addProduct(product) {

        await productsModels.create({...product});
    }

    async editProduct(id, product) {
        await productsModels.updateOne({_id:id}, {...product});

    }

    // async deleteProduct(id) {
        
    //     await productsModels.deleteOne({_id:id});
    // }

    async deleteProduct(id) {
        console.log('ID recibido para eliminación:', id); // 🔍 Verificar qué valor llega
    
        if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
            console.error("ID inválido para eliminación:", id);
            return { error: "ID inválido para eliminación!" };
        }
    
        try {
            const result = await productsModels.deleteOne({ _id: id });
            return result.deletedCount > 0 
                ? { message: "Producto eliminado" } 
                : { error: "Producto no encontrado" };
        } catch (error) {
            console.error(error);
            return { error: "Hubo un problema al eliminar el producto." };
        }
    }async deleteProduct(id) {
    console.log('ID recibido para eliminación:', id); // 🔍 Verificar qué valor llega

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
        console.error("ID inválido para eliminación:", id);
        return { error: "ID inválido para eliminación!" };
    }

    try {
        const result = await productsModels.deleteOne({ _id: id });
        return result.deletedCount > 0 
            ? { message: "Producto eliminado" } 
            : { error: "Producto no encontrado" };
    } catch (error) {
        console.error(error);
        return { error: "Hubo un problema al eliminar el producto." };
    }
}

}

export default ProductManager;