import {Router} from "express";
import {CartManagerFile} from "../managers/CartManagerFile.js";

const path = "carts.json";
const router = Router();
const cartManagerFile = new CartManagerFile(path);



router.get('/', async (req,res)=>{
    const carts = await cartManagerFile.getCarts();
    res.send({
        status:"succes",
        carritos: carts
    })
})


router.get('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const response = await cartManagerFile.getCartProducts(cid);
        res.json(response);
    } catch (error) {
        res.send('Error al obtener el carrito');
    }
});



router.post('/', async (req,res)=>{ //creo
    try {
        const response = await cartManagerFile.newCart();
        res.send(response);
    } catch (error) {
        res.send ('Error al crear el carrito');
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManagerFile.addProductToCart(cid, pid);
        res.send('Producto agregado al carrito');
    } catch (error) {
        res.send('Error al agregar el producto');
    }
    });

export {router as cartRouter};