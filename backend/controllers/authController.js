import { User } from "../models/database.js";
import { database } from "../models/database.js";
import Jwt from "jsonwebtoken";

// Blacklist temporanea in memoria per i token invalidati
const blacklistedTokens = new Set();

export class AuthController {

    static async checkCredentials(req) {

        let usr = new User({username: req.body.usr, password: req.body.pwd}); //for hashing pwd

        let foundUser = await User.findOne({ 
            where: {
                username: usr.username, 
                password: usr.password
            } 
        });

        return foundUser !== null;
    }

    static newToken(username) {

        const token = Jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1y' });
        return { token };

    }

    static isTokenValid(token, callback) {

        if ( blacklistedTokens.has(token) ) 
            callback(new Error("Token non valido!"), null);
        else 
            Jwt.verify(token, process.env.JWT_SECRET, callback);
    
    }

    static invalidateToken(req, res) {

        const token = req.body.token;

        if (!token) {
            return res.status(400).json({ error: "Token richiesto" });
        }

        blacklistedTokens.add(token);
        return res.status(200).json({ message: "Token invalidato con successo!" });
    
    }

    static async saveUser(user) {

        let newUser = new User({username: user.usr, password: user.pwd});

        let foundUser = await User.findOne({ 
            where: { username: newUser.username } 
        });

        if (foundUser)
            throw new Error("Username già esistente!");
        else
            return newUser.save();

    }

    static async resetDatabase() {

        blacklistedTokens.clear();
        return await database.sync({ force: true });
    
    }

}