import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.status(200).json({ success: true, message: 'Task Management API is running.' }));
app.use('/api/tasks', taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
