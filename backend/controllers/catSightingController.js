import { CatSighting } from "../models/database.js";

export class CatSightingController {

    static async getAll(req, res) {
        
        return CatSighting.scope('all').findAll();
    
    }

    static async getById(req) {
    
        let id = req.params.id;
        return CatSighting.scope('full').findByPk(id);
    
    }

    static async create(req) {

        let catSighting = CatSighting.build(req.body);
        catSighting.UserUsername = req.username;
        return catSighting.save();

    }

}