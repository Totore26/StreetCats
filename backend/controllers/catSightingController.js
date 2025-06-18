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
        
        let data = { ...req.body }; // creo una copia cosi req rimane invariato 
        if (req.file) data.photoPath = `/uploads/${req.file.filename}`;
        
        let catSighting = CatSighting.build(data);
        catSighting.UserUsername = req.username;
        return catSighting.save();
    }
}