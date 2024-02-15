import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import apiFilters from "../utils/apiFilters.js";

// /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
    const apifilters = new apiFilters(Product, req.query).search().filters();
    const resPerPage = 4;

    let products = await apifilters.query;
    let filteredProductsCount = products.length;



    apifilters.pagination(resPerPage);
    products = await apifilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
});

// /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    });
});

// /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});

// /api/v1/products/:id
export const updateProductDetails = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json({
        product,
    });
});

// /api/v1/products/:id
export const deleteProductDetails = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        message: "Product",
    });
});

export const createProductReview = catchAsyncErrors(async (req, res) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user._id.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

export const getProductReviews = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
    });
});

export const deleteReview = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req?.query?.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
        numOfReviews === 0
            ? 0
            : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
              numOfReviews;

    product = await Product.findByIdAndUpdate(
        req.query.productId,
        { reviews, numOfReviews, ratings },
        { new: true }
    );

    res.status(200).json({
        success: true,
        product,
    });
});
