import { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadsRouter = Router();

// Настраиваем multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const upload = multer({ storage });

// Роут для загрузки изображения
uploadsRouter.post('/admin/uploads', upload.single('image'), (req: Request, res: Response) => {
    console.log('uploads');
    console.log(req);
    if (!req.file) {
        res.status(400).json({ message: 'Файл не загружен' });
        return;
    }

    console.log('uploads 222');
    // 👇 Формируем путь к изображению
    const fileUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl });
});

export default uploadsRouter;
