import express from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import {
  loginAdminController,
  registerAdminController,
  updateAdminPasswordController,
  getAllAdminsController,
} from "../controllers/adminController";

const adminRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/v1/admins/register/newAdmin:
 *   post:
 *     summary: Register a new admin by an existing admin.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The admin's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: admin@example.com
 *               mobile:
 *                 type: string
 *                 description: The admin's mobile.
 *                 example: 12456
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: Admin@123
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Error registering admin.
 */

adminRouter.post("/register/newAdmin", verifyToken, isAdmin, registerAdminController);

/**
 * @swagger
 * /api/v1/admins/login:
 *   post:
 *     summary: Login an admin user.
 *     description: Authenticates an admin user with a token and login credentials.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *                 description: The admin's password.
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                   description: The JWT token for the authenticated session.
 *       401:
 *         description: Unauthorized. Invalid credentials or token.
 *       403:
 *         description: Forbidden. User is not an admin.
 *       500:
 *         description: Internal server error.
 */

adminRouter.post("/login", loginAdminController);

/**
 * @swagger
 * /api/v1/admins:
 *   get:
 *     summary: Get all admins
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     responses:
 *       200:
 *         description: Successfully retrieved all admins.
 *       500:
 *         description: Error retrieving admins.
 */
adminRouter.get("/", verifyToken, isAdmin, getAllAdminsController);

/**
 * @swagger
 * /api/v1/admins/updatePassword:
 *   put:
 *     summary: Update password of an admin
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: JWT
 *         description: Token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordNew:
 *                 type: string
 *                 description: The admin's new password.
 *                 example: Admin@123
 *               passwordOld:
 *                 type: string
 *                 description: The admin's old password.
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin updated successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Error updating admin.
 */

adminRouter.put("/updatePassword", verifyToken, isAdmin, updateAdminPasswordController);

export default adminRouter;
