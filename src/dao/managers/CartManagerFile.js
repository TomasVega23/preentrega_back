import fs from "fs";
import path from "path";
import __dirname from "../../utils.js";
import { v4 as uuidv4 } from 'uuid';

class CartManagerFile {
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }
    getCarts = async () => {
        const response = await fs.promises.readFile(this.path, 'utf-8');
        const responseJSON = JSON.parse(response);
        return responseJSON;
    }
    getCartProducts = async (id) => {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id == id);
        if(cart){
            return cart.products;
        }else{
            console.log('carrito no encontrado');
        }
    }
    
    newCart = async () => {
        const id = uuidv4();
        const newCart = { id, products: [] };

        // Inicializar this.carts aquí
        this.carts = await this.getCarts();
        
        this.carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
        return newCart;
    }

    addProductToCart = async (cart_id, product_id) => {
        const carts = await this.getCarts();
        const index = carts.findIndex(cart => cart.id === cart_id);

        if (index !== -1) {
            const cartProducts = await this.getCartProducts(cart_id);
            const existingProduct = cartProducts.findIndex(product => product.product_id === product_id);        
            if(existingProduct !== -1){
                cartProducts[existingProduct].quantity = cartProducts[existingProduct].quantity +1;
            }else{
                cartProducts.push({product_id, quantity: 1});
            }
            carts[index].products = cartProducts;
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            console.log('producto agregado')
        }else{
            console.log('carrito no encontrado')
        }
    }
}

export {CartManagerFile};