import { Router } from "express";
import {CartManagerDB} from "../dao/dbManagers/CartManagerDB.js"
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/products.model.js";

const router = Router();

const cartManagerMongo = new CartManagerDB();

router.get('/', async (req,res)=>{

    const carts = await cartManagerMongo.getCarts();

    res.send({
        status:"succes",
        carritos: carts
    })
})

router.get('/:cid', async (req,res)=>{
    const cid = req.params.cid;
    const cart = await cartManagerMongo.getCartByID(cid);
    if (!cart) {  
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(cart);
})

router.post("/", async (req, res) => {

    const {id}= req.body;
    if (!id) {
        return res.status(400).send({
            status: "error",
            message: "Todos los campos son obligatorios"
        })
    }
    const cart = {
        id,
        products: []
    }
    const result = await cartModel.create(cart);

    res.send({
        status: "success",
        message: result
    })
})

router.post('/:cid/product/:pid', async (req,res)=>{ //creo
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                msg: `El carrito con el id ${cid} no existe`
            });
        }
        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).json({
                status: "error",
                msg: `El producto con el id ${pid} no existe`
            });
        }
        const updatedCart = await cartManagerMongo.addProductInCart(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Error al agregar el producto al carrito"
        });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                msg: `El carrito con el id ${cid} no existe`
            });
        }
        const indexProduct = cart.products.findIndex(product => product.product == pid);
        if (indexProduct === -1) {
            return res.status(404).json({
                status: "error",
                msg: `El producto con el id ${pid} no está en el carrito`
            });
        }
        cart.products.splice(indexProduct, 1);
        await cart.save();
        res.json({
            status: "success",
            msg: `El producto con el id ${pid} fue eliminado del carrito`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Error al eliminar el producto del carrito"
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                msg: `El carrito con el id ${cid} no existe`
            });
        }
        cart.products = [];
        await cart.save();
        res.json({
            status: "success",
            msg: `Se han eliminado todos los productos del carrito con el id ${cid}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Error al eliminar todos los productos del carrito"
        });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                msg: `El carrito con el id ${cid} no existe`
            });
        }
        cart.products = products.map(product => ({
            product: product.productId,
            quantity: product.quantity
        }));
        await cart.save();
        res.json({
            status: "success",
            msg: `El carrito con el id ${cid} fue actualizado`,
            cart: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Error al actualizar el carrito"
        });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                msg: `El carrito con el id ${cid} no existe`
            });
        }
        const indexProduct = cart.products.findIndex(product => product.product == pid);
        if (indexProduct === -1) {
            return res.status(404).json({
                status: "error",
                msg: `El producto con el id ${pid} no está en el carrito`
            });
        }
        cart.products[indexProduct].quantity = quantity;
        await cart.save();
        res.json({
            status: "success",
            msg: `La cantidad del producto con el id ${pid} en el carrito ha sido actualizada`,
            cart: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            msg: "Error al actualizar la cantidad del producto en el carrito"
        });
    }
});

export {router as cartRouter};