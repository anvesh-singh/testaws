"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mainrouter_1 = __importDefault(require("./routes/mainrouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5000"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Parse JSON bodies
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Mount other routers
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});
app.use("/", mainrouter_1.default);
/**
 * Calls the Python inference script and returns its JSON output.
 */
function callModel(payload) {
    const backendDir = path_1.default.resolve(__dirname, "../../Ai/backend");
    // Try to use venv Python if available
    const venvPyWin = path_1.default.join(backendDir, ".venv", "Scripts", "python.exe");
    const venvPyNix = path_1.default.join(backendDir, ".venv", "bin", "python");
    let pythonCmd;
    if (process.platform === "win32" && fs_1.default.existsSync(venvPyWin)) {
        pythonCmd = venvPyWin;
    }
    else if (process.platform !== "win32" && fs_1.default.existsSync(venvPyNix)) {
        pythonCmd = venvPyNix;
    }
    else {
        pythonCmd = process.platform === "win32" ? "py" : "python3";
    }
    const scriptPath = path_1.default.join(backendDir, "model.py");
    return new Promise((resolve, reject) => {
        const py = (0, child_process_1.spawn)(pythonCmd, [scriptPath], { cwd: backendDir });
        let data = "";
        let errorOutput = "";
        py.stdout.on("data", (chunk) => (data += chunk.toString()));
        py.stderr.on("data", (chunk) => (errorOutput += chunk.toString()));
        py.on("error", (err) => {
            console.error("Failed to start Python process:", err);
            reject(err);
        });
        py.on("close", (code) => {
            if (code !== 0) {
                console.error(`Python exited with code ${code} and errors:\n${errorOutput}`);
                return reject(new Error(`Python exited with code ${code}. ${errorOutput}`));
            }
            try {
                resolve(JSON.parse(data));
            }
            catch (e) {
                console.error("Invalid JSON from Python:", data);
                reject(new Error(`Invalid JSON from Python: ${e.message}`));
            }
        });
        py.stdin.write(JSON.stringify(payload));
        py.stdin.end();
    });
}
// Prediction endpoint
app.post("/api/predict", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, top_k } = req.body;
    try {
        const result = yield callModel({ command: "predict", title, top_k });
        res.json(result);
    }
    catch (e) {
        console.error("Predict error:", e.message);
        res.status(500).json({ error: e.message });
    }
}));
// Recommendation endpoint
app.post("/api/recommend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { session_index, n } = req.body;
    try {
        const result = yield callModel({ command: "recommend", session_index, n });
        res.json(result);
    }
    catch (e) {
        console.error("Recommend error:", e.message);
        res.status(500).json({ error: e.message });
    }
}));
//*************************** ML SERVER***************************************
// Start the server
app.listen(PORT, (err) => {
    if (err)
        console.log("Server error:", err);
    console.log(`App is listening on port ${PORT}`);
});
