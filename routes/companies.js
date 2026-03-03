const express = require("express");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companies");

// Include other resource routers
const bookingRouter = require("./bookings");

const router = express.Router();
const { protect, authorization } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:companyId/bookings", bookingRouter);

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - tel
 *         - website
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: 64a1b2c3d4e5f67890123456
 *         name:
 *           type: string
 *           description: Company name (max 50 characters)
 *           example: Google Thailand
 *         address:
 *           type: string
 *           description: Company address
 *           example: 123 Sukhumvit Road, Bangkok
 *         tel:
 *           type: string
 *           description: Telephone number
 *           example: "02-1234567"
 *         website:
 *           type: string
 *           description: Company website URL
 *           example: https://www.google.co.th
 *         description:
 *           type: string
 *           description: Company description (max 500 characters)
 *           example: A global technology company
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date company was added
 */

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to return e.g. name,tel
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field e.g. name or -name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company (Admin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin role required
 */

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a single company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     responses:
 *       200:
 *         description: Company data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Company not found
 */

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company (Admin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Company not found or validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin role required
 */

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company and its bookings (Admin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Company not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin role required
 */

router
  .route("/")
  .get(getCompanies)
  .post(protect, authorization("admin"), createCompany);
router
  .route("/:id")
  .get(getCompany)
  .put(protect, authorization("admin"), updateCompany)
  .delete(protect, authorization("admin"), deleteCompany);

module.exports = router;