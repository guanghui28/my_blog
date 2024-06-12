import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userRoutes from "./routes/user.route.js";
configDotenv();

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDb is connected");
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();

app.use("/api/user", userRoutes);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
