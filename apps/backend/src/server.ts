// @ts-nocheck
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mainrouter from "./routes/mainrouter";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));




// Parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Mount other routers
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/", mainrouter);

// Define payload types
interface PredictPayload {
  command: "predict";
  title: string;
  top_k: number;
}
interface RecommendPayload {
  command: "recommend";
  session_index: number;
  n: number;
}

type ModelPayload = PredictPayload | RecommendPayload;

/**
 * Calls the Python inference script and returns its JSON output.
 */
function callModel(payload: ModelPayload): Promise<any> {
  const backendDir = path.resolve(__dirname, "../../Ai/backend");

  // Try to use venv Python if available
  const venvPyWin = path.join(backendDir, ".venv", "Scripts", "python.exe");
  const venvPyNix = path.join(backendDir, ".venv", "bin", "python");
  let pythonCmd: string;
  if (process.platform === "win32" && fs.existsSync(venvPyWin)) {
    pythonCmd = venvPyWin;
  } else if (process.platform !== "win32" && fs.existsSync(venvPyNix)) {
    pythonCmd = venvPyNix;
  } else {
    pythonCmd = process.platform === "win32" ? "py" : "python3";
  }

  const scriptPath = path.join(backendDir, "model.py");

  return new Promise((resolve, reject) => {
    const py = spawn(pythonCmd, [scriptPath], { cwd: backendDir });

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
        console.error(
          `Python exited with code ${code} and errors:\n${errorOutput}`
        );
        return reject(
          new Error(`Python exited with code ${code}. ${errorOutput}`)
        );
      }
      try {
        resolve(JSON.parse(data));
      } catch (e: any) {
        console.error("Invalid JSON from Python:", data);
        reject(new Error(`Invalid JSON from Python: ${e.message}`));
      }
    });

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

// Prediction endpoint
app.post("/api/predict", async (req: Request, res: Response) => {
  const { title, top_k } = req.body as { title: string; top_k: number };
  try {
    const result = await callModel({ command: "predict", title, top_k });
    res.json(result);
  } catch (e: any) {
    console.error("Predict error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Recommendation endpoint
app.post("/api/recommend", async (req: Request, res: Response) => {
  const { session_index, n } = req.body as { session_index: number; n: number };
  try {
    const result = await callModel({ command: "recommend", session_index, n });
    res.json(result);
  } catch (e: any) {
    console.error("Recommend error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
//*************************** ML SERVER***************************************

// Start the server
app.listen(PORT, (err) => {
  if (err) console.log("Server error:", err);
  console.log(`App is listening on port ${PORT}`);
});
