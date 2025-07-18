import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { CatSightingController } from "../controllers/catSightingController.js";
import { requireAuth } from "../middleware/authorizationMiddleware.js";

export const CatSightingRouter = express.Router();

/**
 * @swagger
 * /catsightings:
 *   get:
 *     summary: Get all cat sightings
 *     description: Returns a list of cat sightings
 *     tags: [Cat Sightings]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of sightings
 *       500:
 *         description: Server error
 */
CatSightingRouter.get("/catsightings", async (req, res, next) => {
    
    CatSightingController.getAll(req, res)
        .then( result => {res.status(200).json(result);} )
        .catch( err => {next(err);} );

});

/**
 * @swagger
 * /catsightings/{id}:
 *   get:
 *     summary: Get a specific cat sighting
 *     description: Returns complete details of a cat sighting with related comments
 *     tags: [Cat Sightings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cat sighting
 *     responses:
 *       200:
 *         description: Cat sighting details
 *       404:
 *         description: Sighting not found
 *       500:
 *         description: Server error
 */
CatSightingRouter.get("/catsightings/:id", async (req, res, next) => {

    CatSightingController.getById(req)
        .then( result => {res.status(200).json(result);} )
        .catch( err => {next(err);} );

});

/**
 * @swagger
 * /catsightings:
 *   post:
 *     summary: Create a new cat sighting
 *     description: Create a new cat sighting (requires authentication)
 *     tags: [Cat Sightings]
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data for the new cat sighting
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - latitude
 *               - longitude
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tabby cat in Garibaldi Square"
 *               description:
 *                 type: string
 *                 example: "A beautiful tabby cat sleeping on a bench"
 *               image:
 *                 type: File
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 40.8518
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 14.2681
 *     responses:
 *       201:
 *         description: Cat sighting successfully created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
CatSightingRouter.post("/catsightings", requireAuth, upload.single('image'), async (req, res, next) => {

    CatSightingController.create(req, res)
        .then( result => {res.status(201).json(result);} )
        .catch( err => {next(err);} );

});