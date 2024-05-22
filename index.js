require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import ConnectDB from "./database/connection";
import Auth from "./API/Auth";

const zomato = express();

// Middleware setup
zomato.use(helmet());
zomato.use(cors());
zomato.use(express.json());
zomato.use(express.urlencoded({ extended: false }));

// Routes
zomato.use("/auth", Auth);

// Default route
zomato.get("/", (req, res) => res.json({ message: "Connection established" }));

// Start server and connect to database
zomato.listen(4000, () => {
    ConnectDB()
        .then(() => console.log("Server running on port 4000"))
        .catch((error) => console.log("Database connection failed", error));
});
