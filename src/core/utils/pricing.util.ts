import { DiscountType } from '@prisma/client';

export function calculateFinalPrice(
    basePrice: number,
    discounts: { discount: { type: DiscountType; value: number; active: boolean } }[],
): number {
    let price = basePrice;
    for (const { discount } of discounts) {
        if (!discount.active) continue;
        if (discount.type === 'PERCENT') price -= (price * discount.value) / 100;
        if (discount.type === 'FIXED') price -= discount.value;
    }
    return Math.max(price, 0);
}
