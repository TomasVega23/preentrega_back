import {Router} from "express";
import {ProductManagerFile} from "../managers/ProductManagerFile.js";

const path = "products.json";
const router = Router();
const productManagerFile = new ProductManagerFile(path);

router.get('/', async (req,res)=>{
    const limit = parseInt(req.query.limit) || 0;
    const products = await productManagerFile.getProducts()
    if(limit == 0){
        res.status(200).send({products});
    }else{
        const resultado = products.slice(0,limit);
        res.status(200).send({products: resultado});
    }
})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const products = await productManagerFile.getProducts();
    const product = products.find(product => product.id == pid);  
    if (!product) {  
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});


router.post('/', async (req,res)=>{ //creo
    try {
        const product = req.body;
        // Verificar que los campos obligatorios estén presentes
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const createdProduct = await productManagerFile.createProduct(product);
        res.status(201).json({
            status: 'success',
            msg: 'Producto creado',
            product: createdProduct,
        });
    } catch (error) {
        res.status(500).send({ error: 'Error al crear el producto' });
    }
})

router.put('/:pid', async (req,res)=>{
    try {
        const pid = req.params.pid;
        const updatedProduct = req.body;
        const product = await productManagerFile.updateProduct(pid, updatedProduct);
        if (product) {
            res.json({
                status: 'success',
                msg: `Producto actualizado con ID: ${pid}`,
                product,
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el producto' });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const deletedProduct = await productManagerFile.deleteProduct(pid);

        if (deletedProduct) {
            res.json({
                status: 'success',
                msg: `Producto eliminado con ID: ${pid}`,
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el producto' });
    }
});

export {router as productRouter};