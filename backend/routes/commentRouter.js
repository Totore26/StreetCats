import express from "express";
import { CommentController } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/authorization.js";

export const CommentRouter = express.Router();

/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment for a specific cat sighting (requires authentication)
 *     tags: [Comments]
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cat sighting to comment on
 *     requestBody:
 *       description: Comment content
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This cat looks so cute!"
 *     responses:
 *       201:
 *         description: Comment successfully created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cat sighting not found
 *       500:
 *         description: Server error
 */
CommentRouter.use("/comments/:id",requireAuth, (req, res, next) => {

    CommentController.create(req)
        .then( result => {res.status(201).json(result);} )
        .catch( err => {next(err);} );

});