import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DbConnection = async () => {
  try {
    const MONGODB_URI = process.env.MONGODDB_URI;
    const DB_PASSWORD = process.env.DB_PASSWORD;

    // Validate that required environment variables are available
    if (!MONGODB_URI || !DB_PASSWORD) {
      throw new Error("Environment variables MONGODDB_URI and DB_PASSWORD are required!");
    }
    const DB = MONGODB_URI.replace("<DB_PASSWORD>", DB_PASSWORD);
    await connect(DB);
    console.log("Connected to MongoDB Database 🗄️");
  } catch (err) {
    console.error("Failed to connect to MongoDB Database ❌", err);
  }
};

export default DbConnection;
