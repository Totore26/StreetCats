import express from "express";
import { CatSightingController } from "../controllers/catSightingController.js";
import { requireAuth } from "../middleware/authorization.js";

export const CatSightingRouter = express.Router();

/**
 * @swagger
 * /catsightings/map:
 *   get:
 *     summary: Get all cat sightings for the map
 *     description: Returns a list of cat sightings with essential information for map display
 *     tags: [Cat Sightings]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of sightings for map display
 *       500:
 *         description: Server error
 */
CatSightingRouter.get("/catsightings/map", async (req, res) => {

    CatSightingController.getAllForMap(req, res)
        .then( result => {res.status(200).json(result);} )
        .catch( error => {next(error);} );

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
        .catch( error => {next(error);} );

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
 *         application/json:
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
 *                 type: string
 *                 example: "https://example.com/cat-image.jpg"
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
CatSightingRouter.post("/catsightings", requireAuth, async (req, res, next) => {

    CatSightingController.create(req, res)
        .then( result => {res.status(201).json(result);} )
        .catch( error => {next(error);} );

});