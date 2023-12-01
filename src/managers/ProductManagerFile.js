import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class ProductManagerFile {
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }
    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,'utf-8');
            const products = JSON.parse(data);
            return products;
        }else{
            return [];
        }
    }
    createProduct = async (product) => {
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1;
        }else{
            product.id = products[products.length-1].id + 1;
        }
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'))
        return products;
    }

    getProductById = async(id) => {
        const products = await this.getProducts();
        products.find(product => product.id === id);
        if(products){
            return products;
        }else{
            return "Not Found"
        }
    }
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'), 'utf-8');
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct, id };
            this.saveProducts();
                return true;
        }
        return false;
    }

    deleteProduct = async(id) => {
        try{
            const products = await this.getProducts();
            const productoIndex = products.findIndex( p => p.id == id );
            if( productoIndex != -1 )
            {
                products.splice( productoIndex, 1);
                await fs.promises.writeFile( this.path, JSON.stringify( products, null, '\t') );
                return "Product Delete Successfully.";
            }else{

                return "Prodcut not found";
            }
        }catch (err){
            return err;
        }
    }
}


export {ProductManagerFile};