import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/cart.model.js";
import messageModel from "../dao/models/message.model.js";
import {ProductManagerDB} from "../dao/dbManagers/ProductManagerDB.js"

const productManagerDB = new ProductManagerDB();

class ViewController{
    static products = async (req, res) => {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const products = await productManagerDB.getProducts( limit, page, sort, query);
        res.render("products", { products , user:req.session.user, isAdmin: true})
    }

    static carts = async (req, res) => {
        const carts = await cartModel.find().lean();
        res.render("carts", { carts, isAdmin: true})
    }

    static chat = async (req, res) => {
        const messages = await messageModel.find().lean();
        res.render("chat", { messages, isAdmin: true})
    }

}

export {ViewController}