const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - bookDate
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: 64a1b2c3d4e5f67890123456
 *         bookDate:
 *           type: string
 *           format: date
 *           description: Interview session date (May 10-13, 2022)
 *           example: "2022-05-10"
 *         user:
 *           type: string
 *           description: User ID who made the booking
 *           example: 64a1b2c3d4e5f67890654321
 *         company:
 *           type: string
 *           description: Company ID being booked
 *           example: 64a1b2c3d4e5f67890123456
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Booking creation timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Interview session booking management
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (admin sees all, user sees own)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a single booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking MongoDB ID
 *     responses:
 *       200:
 *         description: Booking data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized to view this booking
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /companies/{companyId}/bookings:
 *   post:
 *     summary: Create a booking for a company (max 3 per user)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookDate
 *             properties:
 *               bookDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-05-10"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Already made 3 bookings or company not found
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update a booking (owner or admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-05-13"
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized to update this booking
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking (owner or admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking MongoDB ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
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
 *       401:
 *         description: Not authorized to delete this booking
 *       404:
 *         description: Booking not found
 */

router.route("/").get(protect, getBookings).post(protect, addBooking);
router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

module.exports = router;