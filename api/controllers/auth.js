import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "./../utils/error.js";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash, // we don't use req.body to create new register because we want to hash the password
        });
        await newUser.save();
        res.status(200).send("User has been created");
    } catch (err) {
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        });
        if (!user) return next(createError(404, "User not found"));
        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isCorrectPassword) {
            return next(createError(400, "Wrong password or username!"))
        }

        const token = jwt.sign(
            // tạo ra token bằng id, isAdmin và JWT (JWT được lưu trong file .env)
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
        );
        const { password, isAdmin, ...otherDetails } = user._doc;
        // const { password, isAdmin, ...otherDetails } = { ...user._doc };
        res.cookie("access_token", token, { httpOnly: true }) // not allow any client secret to reach thi cookie
            .status(200)
            .json({details: {...otherDetails}, isAdmin})
    } catch (err) {
        next(err);
    }
};
