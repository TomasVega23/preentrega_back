import productModel from "../dao/models/products.model.js";
import mongoosepaginte from "mongoose-paginate-v2";

productModel.schema.plugin(mongoosepaginte);

export class Productrepository {
    getProducts = async (req,res)=>{
        try {
            const { limit = 10, page = 1, sort = '', query = '' } = req.query;

            const products = await productModel.findById( limit, page, sort, query);
            res.send({products})
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Internal Server Error" });
        }
    }

    getProductByID = async (req,res)=>{
        const pid = req.params.pid;
        const product = await productModel.findById(pid);
        if (!product) {  
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    }

    createProduct =  async (req, res) => {
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
        const result = await productModel.create(product);
    
        res.send({
            status: "success",
            message: result
        })
    }

    updateProduct = async (req, res) => {
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
        const result = await productModel.updateOne({ _id: id }, {$set:updatedProduct});
        res.send({
            status: "success",
            message: result
        })
    }

    deleteProduct = async (req, res) => {
        const id = req.params.pid;
        const result = await productModel.deleteOne({ _id: id });
        res.send({
            status: "success",
            message: result
        })
    }
}

