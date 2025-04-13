import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";
import fs from "fs";
import path from "path";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
    flags: "a",
});

app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

const getLocalIp = (): string | null => {
    const ifaces = os.networkInterfaces();
    for (const iface of Object.values(ifaces)) {
        if (!iface) continue;
        for (const alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return null;
};

app.listen(PORT, () => {
    const localIp = getLocalIp();
    console.log("\n🚀 Сервер запущен:\n");
    console.log(`Local:     http://localhost:${PORT}`);
    if (localIp) {
        console.log(`Network:   http://${localIp}:${PORT}`);
    }
    console.log("");
});
