//@ts-nocheck

import express, { Request, Response }  from "express";
import cors from "cors";
import bodyparser from "body-parser";
import mainrouter from "./routes/mainrouter";
import videoRouter from "./routes/videoUploadRouter";
import path from "path";
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const app = express();

//****************************MLSERVER**********************************************
app.use(express.json());

interface PredictPayload {
  command: 'predict';
  title: string;
  top_k: number;
}
interface RecommendPayload {
  command: 'recommend';
  session_index: string;
  n: number;
}

type ModelPayload = PredictPayload | RecommendPayload;

function callModel(payload: ModelPayload): Promise<any> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['model.py']);

    let data = '';
    py.stdout.on('data', (chunk) => (data += chunk.toString()));
    py.stderr.on('data', (err) => console.error(err.toString()));
    py.on('close', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

app.post('/api/predict', async (req: Request, res: Response) => {
  const { title, top_k } = req.body as { title: string; top_k: number };
  try {
    const result = await callModel({ command: 'predict', title, top_k });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/recommend', async (req: Request, res: Response) => {
  const { session_index, n } = req.body as { session_index: string; n: number };
  try {
    const result = await callModel({ command: 'recommend', session_index, n });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
//*************************** ML SERVER***************************************
app.use(cors({
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

app.use(bodyparser.json());
app.use("/", mainrouter);


app.use('/videos', express.static(path.join(__dirname,'uploads'))); 
// serve videos
app.use('/api/videos', videoRouter); // mount video routes

app.listen(process.env.PORT, (err) => {
  if (err) console.log("error ocurred");
  console.log(`app is listening on port ${process.env.PORT}`);
});

