import productsModel from "../models/products.model.js";

class ProductManagerDB {

    getProducts = async (options) => {

        const products = await productsModel.paginate(
            {
                //filter
            },
            {
                options
            }
        );
        return {
            status: "success",
            msg: products
        }
    
    };
    getProductByID = async (pid) => {
        const product = await productsModel.findOne({_id:pid});
        return {
            status: "success",
            msg: product
        }
    }
    }



export {ProductManagerDB};