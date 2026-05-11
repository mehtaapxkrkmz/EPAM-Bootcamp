import cors from 'cors';
import express from 'express';
import { correlationMiddleware, errorHandler } from './middleware/errorHandler';
import { router } from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(correlationMiddleware);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(router);
app.use(errorHandler);

export { app };
