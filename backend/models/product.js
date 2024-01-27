import mongoose, { Mongoose } from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter product name"],
            maxLength: [200, "Product name cannot exceed 200 charecters."],
        },
        price: {
            type: Number,
            required: [true, "Enter product prize"],
            maxLength: [5, "Product price cannot exceed 5 digits."],
        },
        description: {
            type: String,
            required: [true, "Enter product description"],
        },
        ratings: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {  
                    type: String,
                    required: true,
                },
            },
        ],
        category: {
            type: String,
            required: [true, "Enter product category"],
            enum: {
                values: [
                    "Laptops",
                    "Electronics",
                    "Headphones",
                    "Accessories",
                    "Sports",
                    "Books",
                    "Home",
                    "Clothes",
                    "Food",
                    "Cameras",
                ],
                message: "Please select correct category",
            },
        },
        seller: {
            type: String,
            required: [true, "Enter product seller"],
        },
        stock: {
            type: Number,
            required: [true, "Enter product stock"],
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
