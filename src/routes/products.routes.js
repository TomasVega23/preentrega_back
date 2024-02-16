import {Router} from "express";
import { ProductController } from "../controllers/products.controller.js";

const router = Router();


router.get('/', ProductController.getProducts);

router.get('/:pid', ProductController.getProductByID);

router.post("/",ProductController.createProduct);

router.put("/:pid", ProductController.updateProduct);

router.delete("/:pid", ProductController.deleteProduct);

export {router as productRouter};