import mongoose from "mongoose";
import Product from "../models/product.js"
import products from "../seeder/data.js";

const seedProducts = async () => {
    try {
        
        await mongoose.connect("mongodb://localhost:27017/shopit-v2");
        await Product.deleteMany();
        console.log('Products are deleted');
        await Product.insertMany(products);
        console.log("Products are inserted");
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedProducts();