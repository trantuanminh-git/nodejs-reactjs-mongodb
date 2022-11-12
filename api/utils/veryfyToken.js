import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    // console.log(req.cookies);
    const token = req.cookies.access_token;
    if (!token) {
        return next(
            createError(401, "You are not authenticated at verifyToken!")
        );
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            // tức là nếu là TK chính chủ hoặc tài khoản Admin thì mới được quyền xóa tài khoản
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            console.log("here is verify admin 2");
            return next(
                createError(403, "You are not authorized at verify Admin!")
            );
        }
    });
};
