import { Router } from "express";
import { getProducts } from "./controllers/getProducts.controller";

export const productsRouter = Router();

// Получить название, картинку, описание, цену, скидку
productsRouter.get("/", getProducts);

// Получить полную информацию
productsRouter.get("/:id", (req, res) => {
    res.send("product");
});
