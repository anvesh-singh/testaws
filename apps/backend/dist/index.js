"use strict";
//@ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = __importDefault(require("./routes/route"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5000",
}));
app.use(body_parser_1.default.json());
app.use("/", route_1.default);
app.listen(process.env.PORT, (err) => {
    if (err)
        console.log("error ocurred");
    console.log(`app is listening on port ${process.env.PORT}`);
});
