import express from 'express';
import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';
import cors from 'cors';
import dotenv from 'dotenv';
import { getLocalIp } from './core/utils/getLocalIp.util';
import { errorHandler } from './core/middlewares/errorHandler';
import path from 'path';
import { swaggerSpec } from './docs/swagger';
import { router } from './routes';

dotenv.config();

const PORT = process.env.PORT || 3000;

// const swaggerPath = path.resolve(__dirname, './docs/swagger.yaml');
// const swaggerDocument = YAML.load(swaggerPath);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);
app.use(errorHandler);

// Инфа о запущенном сервере
app.listen(PORT, () => {
    const localIp = getLocalIp();

    console.log('\n🚀 Сервер запущен:\n');
    console.log(`Local:     http://localhost:${PORT}`);
    if (localIp) {
        console.log(`Network:   http://${localIp}:${PORT}`);
    }
    console.log('');
});
