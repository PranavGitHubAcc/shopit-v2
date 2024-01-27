import express from "express";
import {
    createProductReview,
    deleteProductDetails,
    deleteReview,
    getProductDetails,
    getProductReviews,
    getProducts,
    newProduct,
    updateProductDetails,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router
    .route("/admin/products")
    .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
router.route("/products/:id").get(getProductDetails);
router
    .route("/admin/products/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProductDetails);
router
    .route("/admin/products/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductDetails);
router
    .route("/review")
    .put(isAuthenticatedUser, createProductReview)
    .get(isAuthenticatedUser, getProductReviews);
router
    .route("/admin/reviews")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);
export default router;
