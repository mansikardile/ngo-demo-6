import { Router } from 'express';
import { loginAdmin, getMe, loginSchema } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate an existing Katalyst Admin and obtain a signed JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@katalyst.org
 *               password:
 *                 type: string
 *                 example: KatalystAdmin@2025
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(loginSchema), loginAdmin);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get Current Admin Profile
 *     description: Retrieve details of currently logged-in Admin using Bearer token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin details
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateJwt, getMe);

export default router;
