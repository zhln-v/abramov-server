import { prisma } from '../../../../core/db';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/categories.schema';
import { NotFoundError } from '../../../../core/errors/AppError';

export class CategoryService {
    /**
     * Получить все категории (без иерархии)
     */
    static async getAll() {
        return prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Получить категорию по ID
     */
    static async getById(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new NotFoundError('Категория не найдена');
        }
        return category;
    }

    /**
     * Создать новую категорию
     */
    static async create(data: CreateCategoryDto) {
        return prisma.category.create({
            data: {
                name: data.name,
                parentId: data.parentId || null,
            },
        });
    }

    /**
     * Обновить существующую категорию
     */
    static async update(id: string, data: UpdateCategoryDto) {
        await this.getById(id); // Проверка
        return prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                parentId: data.parentId ?? undefined,
            },
        });
    }

    /**
     * Удалить категорию
     * Если есть подкатегории — запрещаем
     */
    static async delete(id: string) {
        const children = await prisma.category.findMany({
            where: { parentId: id },
        });
        if (children.length > 0) {
            throw new Error('Нельзя удалить категорию, у которой есть подкатегории');
        }

        await this.getById(id); // Проверка
        return prisma.category.delete({ where: { id } });
    }

    /**
     * Получить подкатегории
     */
    static async getChildren(parentId: string) {
        return prisma.category.findMany({
            where: { parentId },
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Получить дерево категорий (2 уровня вложенности)
     */
    static async getTree() {
        return prisma.category.findMany({
            where: { parentId: null },
            orderBy: { name: 'asc' },
            include: {
                children: {
                    orderBy: { name: 'asc' },
                    include: {
                        children: {
                            orderBy: { name: 'asc' },
                        },
                    },
                },
            },
        });
    }
}
