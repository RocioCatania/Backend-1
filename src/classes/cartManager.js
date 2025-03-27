import { cartModel } from "../models/carts.model.js";


class CartManager {
    async getCarts() {
        
        return await cartModel.find().lean().populate("products.product");
    }

    async getCartById(id) {        
        
        return await cartModel.find({_id:id}).lean();
    }

    async   createCart() {

        return await cartModel.create({products: []});
    }

    async addCartProduct(cid, pid) {

        let cart = await cartModel.findOne({_id:cid}.lean());

        let product = cart.products.find(item => item.product == pid);

                if (product) {
            product.quantity += 1;
        } else {
            let product = {product:pid, quantity:1};
            cart.products.push(product);
        }


        await cartModel.updateOne({_id:cid}, {products:cart.products});

    }

    async deleteProductFromCart(cid, pid) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let products = cart.products.filter(item => item._id != pid);
        console.log(products);
        

        await cartModel.updateOne({_id:cid}, {products:products});
    }

    async deleteProductsFromCart(cid) {            
        await cartModel.updateOne({_id:cid}, {products:[]});
    }

}

export default CartManager