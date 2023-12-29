import {Router} from "express";
import {ProductManagerDB} from "../dao/dbManagers/ProductManagerdb.js"
import productsModel from "../dao/models/products.model.js";

const router = Router();
const productManagerDB = new ProductManagerDB();

router.get('/', async (req,res)=>{
    try {
        const {limit, page, sort, category, price} = req.query
        const options = {
            limit: limit ?? 10,
            page: page ?? 1,
            sort: { price: sort === "asc" ? 1 : -1},
            lean: true,
        }
        const products = await productManagerDB.getProducts(options)
        if(products.hasPrevPage){
            products.prevLink = "/products?page=1"
        }
        if(products.hasNextPage){
            products.nextLink = "/products?page=2"
        }
        
        res.send({
            status:"succes",
            productos: products
        })
    } catch (error) {
        console.log(error);
    }
})


router.get('/:pid', async (req,res)=>{
    const pid = req.params.pid;
    const product = await productManagerDB.getProductByID(pid);
    if (!product) {  
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

router.post("/", async (req, res) => {
    
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
})

router.put("/:pid", async (req, res) => {

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
})

router.delete("/:pid", async (req, res) => {
    
    const id = req.params.pid;
    const result = await productsModel.deleteOne({ _id: id });

    res.send({
        status: "success",
        message: result
    })
})

export {router as productRouter};