import { prisma } from '../../../../core/db';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from '../dto/promocodes.schema';
import { NotFoundError } from '../../../../core/errors/AppError';

export class PromoCodeService {
    static async getAll() {
        return prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' },
            include: { discount: true },
        });
    }

    static async getById(id: string) {
        const promo = await prisma.promoCode.findUnique({
            where: { id },
            include: { discount: true },
        });
        if (!promo) throw new NotFoundError('Промокод не найден');
        return promo;
    }

    static async create(data: CreatePromoCodeDto) {
        return prisma.promoCode.create({ data });
    }

    static async update(id: string, data: UpdatePromoCodeDto) {
        await this.getById(id);
        return prisma.promoCode.update({ where: { id }, data });
    }

    static async delete(id: string) {
        await this.getById(id);

        await prisma.promoCodeRedemption.deleteMany({ where: { promoCodeId: id } });
        return prisma.promoCode.delete({ where: { id } });
    }
}
