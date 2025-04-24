import { Request, Response } from "express";
import { paginationQuerySchema } from "../../../core/pagination/schema";
import { getProductsService } from "../services/getProducts.service";

export const getProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    const parsed = paginationQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        res.status(400).json({
            error: "Ошибка пагинации",
            issues: parsed.error.issues,
        });
        return;
    }

    const { page, limit, sort, order } = parsed.data;

    const result = await getProductsService({ page, limit, sort, order });
    res.json(result);
};
