import { AuthController } from "../controllers/authController.js";

export function requireAuth(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if(!token){
        next({status: 401, message: "Unauthorized"});
        return;
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
        if(err){
            next({status: 401, message: "Unauthorized"}); // send 401 to middleware error handler
        } else {
            req.username = decodedToken.user;
            next();
        }
    });
}