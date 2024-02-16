import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";

const router = Router();

router.get('/', CartsController.GetCarts);

router.get('/:cid', CartsController.GetCartById);

router.post("/",CartsController.PostCart);

router.post('/:cid/product/:pid',CartsController.PostCartProduct);

router.delete('/:cid/products/:pid', CartsController.DeleteProductInCart);

router.delete('/:cid', CartsController.DeleteCart);

router.put('/:cid', CartsController.UpdateCart);

router.put('/:cid/products/:pid', CartsController.UpdateProductInCart);

export {router as cartRouter};