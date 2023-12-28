import cartsModel from "../models/cart.model.js";
import productsModel from "../models/products.model.js";

class CartManagerDB {

    getCarts = async () => {
        const carts = await cartsModel.find()
        return carts;
    }
    getCartByID = async (cid) => {
        const cart = await cartsModel.find({_id:cid})
        return cart;
    }

    createCart = async (cid) => {
        try {
            const id = cid;
            const newCart = { id, products: [] };
            const cart = await newCart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    addProductInCart = async (cid, pid, quantity = 1) => {
        try {
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                return {
                    status: "error",
                    msg: `El carrito con el id ${cid} no existe`
                };
            }
            const product = await productsModel.findById(pid);
            if (!product) {
                return {
                    status: "error",
                    msg: `El producto con el id ${pid} no existe`
                };
            }
            let productsInCart = cart.products;
            const indexProduct = productsInCart.findIndex((product) => product.product == pid);
            if (indexProduct == -1) {
                const newProduct = {
                    product: pid,
                    quantity: quantity
                };
                cart.products.push(newProduct);
            } else {
                cart.products[indexProduct].quantity += quantity;
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    };
}

export {CartManagerDB};