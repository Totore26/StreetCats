import { Comment } from "../models/database.js";

export class CommentController {

    static async create(req) {

        let comment = Comment.build(req.body);
        comment.UserUsername = req.username;
        comment.CatSightingId = req.params.id;
        return comment.save();

    }

}