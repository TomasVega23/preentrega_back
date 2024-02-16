import productsModel from "../dao/models/products.model.js";
import {ProductManagerDB} from "../dao/dbManagers/ProductManagerdb.js"

const productManagerDB = new ProductManagerDB();

class ProductController{
    static getProducts = async (req,res)=>{
        try {
            const {limit, page, sort} = req.query
            const options = {
                limit: limit ?? 10,
                page: page ?? 1,
                sort: { price: sort === "asc" ? 1 : -1},
                lean: true,
            }
            const products = await productManagerDB.getProducts(options)
            if (products.hasPrevPage) {
                products.prevLink = `/products?page=${products.prevPage}`;
            }
            
            if (products.hasNextPage) {
                products.nextLink = `/products?page=${products.nextPage}`;
            }
            
            res.send({
                status: "success",
                productos: products
            })
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Internal Server Error" });
        }
    }
    static getProductByID = async (req,res)=>{
        const pid = req.params.pid;
        const product = await productManagerDB.getProductByID(pid);
        if (!product) {  
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    }


    static createProduct =  async (req, res) => {
        const {title, description, code, price, stock, category}= req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({
                status: "error",
                message: "Todos los campos son obligatorios"
            })
        }
        const product = {
            title,
            description,
            code,
            price,
            stock,
            category
        }
        const result = await productsModel.create(product);
    
        res.send({
            status: "success",
            message: result
        })
    }

    static updateProduct = async (req, res) => {
        const id = req.params.pid;
        const {title, description, code, price, stock, category}= req.body;
        const updatedProduct = {
            title,
            description,
            code,
            price,
            stock,
            category
        }
        const result = await productsModel.updateOne({ _id: id }, {$set:updatedProduct});
        res.send({
            status: "success",
            message: result
        })
    }

    static deleteProduct = async (req, res) => {
        const id = req.params.pid;
        const result = await productsModel.deleteOne({ _id: id });
        res.send({
            status: "success",
            message: result
        })
    }
}

export { ProductController }