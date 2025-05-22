import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Admin API',
            version: '1.0.0',
            description: 'Документация admin-панели',
        },
    },
    apis: [
        path.resolve(__dirname, '../modules/**/*.routes.ts'), // JSDoc в роутерах
        path.resolve(__dirname, '../modules/**/*.controller.ts'), // JSDoc в контроллерах
        path.resolve(__dirname, '../modules/**/*.swagger.yaml'), // yaml в модулях
        path.resolve(__dirname, '../modules/**/**/*.swagger.yaml'), // yaml в модулях
        path.resolve(__dirname, './modules/**/*.swagger.yaml'),
    ],
};

export const swaggerSpec = swaggerJSDoc(options);
