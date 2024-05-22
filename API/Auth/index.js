import express from "express";
import { UserModel } from "../../database/user"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const Router = express.Router();

Router.post("/signin", async (req, res) => {
    try {
        // await UserModel.findEmailAndPhone(req.body.credentials);
        const user=await UserModel.findByEmailAndPassword(
            req.body.credentials
        );
        


       

        // Save the new user to the database
        // const newUser = await UserModel.create(req.body.credentials);

        // Generate a JWT token
        // const token = newUser.generateJwtToken();
        const token = user.generateJwtToken();


        return res.status(201).json({ token,status:"success" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default Router;
