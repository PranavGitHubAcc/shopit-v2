import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

// Create new Order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    });

    res.status(200).json({
        order,
    });
});

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Invalid order id", 404));
    }
    res.status(200).json({
        order,
    });
});

export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).populate(
        "user",
        "name email"
    );

    res.status(200).json({
        orders,
    });
});

// Get all orders - ADMIN
export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        orders,
    });
});

// Update order - ADMIN
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No order found with this id.", 404));
    }
    if (order?.orderStatus === "Delivered") {
        return next(
            new ErrorHandler("You have already delivered this order.", 404)
        );
    }

    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString());
        if (!product) {
            return next(new ErrorHandler("No product found with this id."));
        }
        product.stock = product.stock - item.quantity;
        await product.save();
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    res.status(200).json({
        order,
    });
});
