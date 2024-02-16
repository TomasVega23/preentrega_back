import cartsModel from "../models/cart.model.js";
import productsModel from "../models/products.model.js";

class CartManagerDB {
    constructor(){
        this.cartmodel = cartsModel;
        this.productModel = productsModel;
    }

    async getCarts() {
        try {
            const carts = await this.cartmodel.find();
            return carts;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCartByID(cid) {
        try {
            const cart = await this.cartmodel.findById(cid);
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createCart(cid) {
        try {
            const id = cid;
            const newCart = { id, products: [] };
            const cart = await newCart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    async addProductInCart  (cid, pid, quantity = 1)  {
        try {
            const cart = await this.cartmodel.findById(cid);
            if (!cart) {
                return {
                    status: "error",
                    msg: `El carrito con el id ${cid} no existe`
                };
            }
            const product = await this.productModel.findById(pid);
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