import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/cart.model.js";
import messageModel from "../dao/models/message.model.js";


const router = Router();

router.get("/", (req, res) => {
    res.render("register")
})

router.get("/products", async (req, res) => {
    const products = await productModel.find().lean();

    res.render("products", { products , isAdmin: true})
})

router.get("/carts", async (req, res) => {

    const carts = await cartModel.find().lean();
    res.render("carts", { carts, isAdmin: true})
})

router.get("/chat", async (req, res) => {

    const messages = await messageModel.find().lean();
    res.render("chat", { messages, isAdmin: true})
})





export default router;