import mongoose from "mongoose";
import { config } from "dotenv";

config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const URL = `mongodb+srv://${username}:${password}@cluster0.om84kz0.mongodb.net`;

const Connection = async () => {
  try {
    await mongoose.connect(URL);
    console.log("database connected successfully");
  } catch (error) {
    console.log("Connection error in database: ", error);
  }
};
export default Connection;
