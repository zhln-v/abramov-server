import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateQuery = <T extends ZodSchema<any>>(schema: T) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                error: "Invalid query parameters",
                issues: result.error.issues,
            });
        }

        req.query = result.data;
        next();
    };
};
