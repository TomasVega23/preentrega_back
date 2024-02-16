import productsModel from "../models/products.model.js";


class ProductManagerDB {
    constructor(){
        this.model = productsModel;
    }
    async getProducts (limit, page, sort, query) {
        try {
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                lean: true,
                sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : null
            };
    
            let filter = {};
            if (query) {
                filter = {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { category: { $regex: query, $options: 'i' } },
                        { status: query.toLowerCase() === 'true' }
                ]
            };
        }
            const result = await this.model.paginate(filter, options);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
        
    }

    getProductByID = async (pid) => {
        const product = await productsModel.findOne({_id:pid});
        return {
            status: "success",
            msg: product
        }
    }
    }



export {ProductManagerDB};