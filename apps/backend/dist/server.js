"use strict";
//@ts-nocheck
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mainrouter_1 = __importDefault(require("./routes/mainrouter"));
const videoUploadRouter_1 = __importDefault(require("./routes/videoUploadRouter"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const child_process_1 = require("child_process");
dotenv_1.default.config();
const app = (0, express_1.default)();
//****************************MLSERVER**********************************************
app.use(express_1.default.json());
function callModel(payload) {
    return new Promise((resolve, reject) => {
        const py = (0, child_process_1.spawn)('python3', ['model.py']);
        let data = '';
        py.stdout.on('data', (chunk) => (data += chunk.toString()));
        py.stderr.on('data', (err) => console.error(err.toString()));
        py.on('close', () => {
            try {
                resolve(JSON.parse(data));
            }
            catch (e) {
                reject(e);
            }
        });
        py.stdin.write(JSON.stringify(payload));
        py.stdin.end();
    });
}
app.post('/api/predict', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, top_k } = req.body;
    try {
        const result = yield callModel({ command: 'predict', title, top_k });
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.post('/api/recommend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { session_index, n } = req.body;
    try {
        const result = yield callModel({ command: 'recommend', session_index, n });
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
//*************************** ML SERVER***************************************
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});
// app.use(cors({
//   credentials: true,
//   origin: "http://localhost:5000",
// }));
app.use(body_parser_1.default.json());
app.use("/", mainrouter_1.default);
app.use('/videos', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// serve videos
app.use('/api/videos', videoUploadRouter_1.default); // mount video routes
app.listen(process.env.PORT, (err) => {
    if (err)
        console.log("error ocurred");
    console.log(`app is listening on port ${process.env.PORT}`);
});
