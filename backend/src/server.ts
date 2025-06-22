import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import DbConnection from "./db/db.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 3008;
// database
DbConnection();

app.listen(PORT, () => {
  console.log("Server Up and Running ✅");
});
