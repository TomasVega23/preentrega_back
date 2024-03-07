import {CartManagerDB} from "../dao/dbManagers/CartManagerDB.js"
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/products.model.js";

import { dbCartService } from '../repository/index.js';
import { dbProductService } from '../repository/index.js';
import { dbTicketService } from '../repository/index.js';
import { v4 as uuidv4 } from 'uuid';

import User from '../dao/models/user.model.js';

import mongoose from 'mongoose';

import Ticket from '../dao/models/ticket.model.js';
import productModel from '../dao/models/product.model.js';
import cartModel from '../dao/models/cart.model.js';

import { EError } from '../enums/EError.js';
import { errorHandler } from '../midleware/errorHandler.js';
import { CustomError } from '../services/customError.service.js';
import { generateCartParam } from '../services/cartError.serice.js';


function generateUniqueCode() {
    return uuidv4();
  }
  
  function calculateTotalAmount(products) {
    let totalAmount = 0;
    for (const item of products) {
      totalAmount += item.product.price * item.quantity;
    }
    return totalAmount;
  }
  
  
  export async function purchaseCart(req, res) {
    try {
      const cartId = req.params.cartId;
      console.log("Iniciando proceso de compra...");
      console.log("El ID del carrito es:", cartId);
  
      const cart = await dbCartService.getCartById(cartId);
      console.log("Carrito encontrado:", cart);
  
      if (!cart) {
        console.log("El carrito no existe");
        return res.status(404).json({ error: "El carrito no existe" });
      }
  
      // Verificar el stock de cada producto en el carrito
      for (const cartProduct of cart.products) {
        const product = await productModel.findById(cartProduct.product);
        console.log("Producto:", product); // Verifica que el producto se ha encontrado correctamente
      
        const quantityInCart = cartProduct.quantity;
      
        console.log(`Verificando stock para el producto ${product.title}...`);
      
        if (product.stock < quantityInCart) {
          console.log(`No hay suficiente stock para el producto ${product.title}`);
          // Ajusta la cantidad en el carrito para que no exceda la cantidad disponible en stock
          cartProduct.quantity = product.stock;
          // Actualiza el carrito en la base de datos
          await cart.save();
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${product.title}. La cantidad máxima disponible es ${product.stock}` });
        }
      }
  
      // Actualizar el stock de cada producto y crear el ticket de compra
      const ticketProducts = [];
      let totalAmount = 0;
  
      for (const cartProduct of cart.products) {
        const product = await productModel.findById(cartProduct.product);
        const quantityInCart = cartProduct.quantity;
  
        console.log(`Actualizando stock para el producto ${product.title}...`);
  
        // Actualizar el stock del producto
        product.stock -= quantityInCart;
        await product.save();
  
        // Agregar el producto al ticket
        ticketProducts.push({
          product: product._id,
          quantity: quantityInCart
        });
  
        // Calcular el monto total de la compra
        totalAmount += product.price * quantityInCart;
      }
  
      console.log("Creando el ticket de compra...");
  
      // Crear el ticket de compra
      const newTicket = {
        code: generateUniqueCode(), 
        purchase_datetime: new Date(),
        amount: totalAmount,
      };
      const ticket = await Ticket.create(newTicket);
  
      console.log("Ticket creado:", ticket);
  
      // Limpiar el carrito después de la compra
    cart.products = [];
    await cart.save();
  
    console.log("Compra realizada exitosamente");

    return res.status(200).json({ status: "success", message: "Compra realizada exitosamente", ticket: ticket });
    } catch (error) {
    console.error("Error al procesar la compra:", error);
    return res.status(500).json({ error: "Error al procesar la compra" });
    }
}

const cartManagerMongo = new CartManagerDB();

class CartsController {
    static GetCarts = async (req,res)=>{
        const carts = await cartManagerMongo.getCarts();
        res.send({
            status:"succes",
            carritos: carts
        })
    }

    static GetCartById = async (req,res)=>{
        const cid = req.params.cid;
        const cart = await cartManagerMongo.getCartByID(cid);
        if (!cart) {  
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(cart);
    }

    static PostCart =  async (req, res) => {
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
    }

    static PostCartProduct =  async (req,res)=>{ //creo
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
    }

    static DeleteProductInCart = async (req, res) => {
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
    }

    static DeleteCart = async (req, res) => {
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
    }

    static UpdateCart = async (req, res) => {
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
    }

    static UpdateProductInCart = async (req, res) => {
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
    }

}


export { CartsController }