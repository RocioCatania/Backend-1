import {productsModels}  from "../models/products.models.js";
import mongoose from "mongoose";


class ProductManager {


    async getProducts(limit, page, query, sort) {
        try {
            limit = limit ? limit : 10;
            page = page >= 1 ? page : 1;
            query = query ? query : "";
            sort = sort ? sort : "asc";
            let result;            
    
            if (query) {            
                result = await productsModels.paginate({category:query}, {limit:limit, page:page, sort:sort, lean:true});
            } else {                
                result = await productsModels.paginate({}, {limit:limit, page:page, sort:sort, lean:true});
            }

            result = {status:"success", payload:result.docs, totalPages:result.totalPages, prevPage:result.prevPage, nextPage:result.nextPage, page:result.page, hasPrevPage:result.hasPrevPage, hasNextPage:result.hasNextPage, prevLink:(result.hasPrevPage ? "/?limit=" + limit + "&page=" + (result.page-1) : null), nextLink:(result.hasNextPage ? "/?limit=" + limit + "&page=" + (result.page+1) : null)};
    
            return result;
        } catch (error) {
            return {status:"error", payload:""}
        }
    }


    async getProductById(id) {        
        let product = await productsModels.find({_id:id});
        
        return product ? product : {"error":"No se encontró el Producto!"};
    }
    
    async addProduct(product) {

        await productsModels.create({...product});
    }

    async editProduct(id, product) {
        await productsModels.updateOne({_id:id}, {...product});

    }


    async deleteProduct(id) {
        console.log('ID recibido para eliminación:', id);
    
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
    console.log('ID recibido para eliminación:', id);

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