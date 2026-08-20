import { Router } from 'express';
import {
  signupStudent,
  loginStudent,
  googleStudentAuth,
  getStudentMe,
  updateStudentProfile,
  signupSchema,
  loginSchema,
  googleAuthSchema,
} from '../controllers/studentAuth.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateStudentJwt } from '../middleware/studentAuth.js';

const router = Router();

router.post('/signup', validateRequest(signupSchema), signupStudent);
router.post('/login', validateRequest(loginSchema), loginStudent);
router.post('/google', validateRequest(googleAuthSchema), googleStudentAuth);
router.get('/me', authenticateStudentJwt, getStudentMe);
router.patch('/profile', authenticateStudentJwt, updateStudentProfile);

export default router;
