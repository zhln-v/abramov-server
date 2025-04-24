import { Request, Response } from 'express';

export abstract class BaseController<TService> {
    constructor(protected readonly service: TService) {}

    async getAll(req: Request, res: Response) {
        const result = await (this.service as any).getAll();
        return res.json(result);
    }

    async getById(req: Request, res: Response) {
        const result = await (this.service as any).getById(req.params.id);
        return res.json(result);
    }

    async delete(req: Request, res: Response) {
        await (this.service as any).delete(req.params.id);
        return res.status(204).send();
    }
}
