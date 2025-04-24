import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import { getLocalIp } from "./core/utils/getLocalIp.util";
import { router } from "./features/routes";
import { errorHandler } from "./core/middlewares/errorHandler";

dotenv.config();

const PORT = process.env.PORT || 3000;
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
    flags: "a",
});

const app = express();

app.use(cors());
app.use(express.json());

// Логгирование
app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

app.use(errorHandler);
app.use(router);

// Инфа о запущенном сервере
app.listen(PORT, () => {
    const localIp = getLocalIp();

    console.log("\n🚀 Сервер запущен:\n");
    console.log(`Local:     http://localhost:${PORT}`);
    if (localIp) {
        console.log(`Network:   http://${localIp}:${PORT}`);
    }
    console.log("");
});
