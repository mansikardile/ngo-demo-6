import express from 'express';
import cors from 'cors';
import studentAuthRoutes from './routes/studentAuth.routes.js';
import studentSessionRoutes from './routes/studentSession.routes.js';
import scholarshipRoutes from './routes/scholarship.routes.js';
import mentorshipRoutes from './routes/mentorship.routes.js';
import techlabRoutes from './routes/techlab.routes.js';

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Katalyst Student API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/student/auth', studentAuthRoutes);
app.use('/api/auth', studentAuthRoutes);

app.use('/api/student/sessions', studentSessionRoutes);
app.use('/api/sessions', studentSessionRoutes);

app.use('/api/student/application', scholarshipRoutes);
app.use('/api/student/scholarship', scholarshipRoutes);
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/application', scholarshipRoutes);

app.use('/api/student/mentorship', mentorshipRoutes);
app.use('/api/mentorship', mentorshipRoutes);

app.use('/api/student/learning', techlabRoutes);
app.use('/api/learning', techlabRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Student API Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
