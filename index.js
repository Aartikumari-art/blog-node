const dotenv = require("dotenv");
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const dbConnect = require("./connection"); 
const blogRoutes = require("./routes/blogRoutes"); 
const userRoutes = require("./routes/userRoutes"); 

const { getBaseUrl, getEnvironment } = require("./utils/helpers");


dotenv.config({ path: `.env.${getEnvironment()}` });
console.log("Environment:", getEnvironment());

const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("📢 Blog API is running...");
});

app.use("/blog", blogRoutes); 
app.use("/user", userRoutes); 


app.use("/", (req, res) => {
  res.status(404).json({ status: 404, message: "Route not found" });
});


require("dotenv").config(); 

const mongoose = require("mongoose");

const dbUri = process.env.LOCAL_DB;

if (!dbUri) {
  console.error(
    "❌ MongoDB URI is undefined. Check your .env and variable name."
  );
  process.exit(1);
}

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5050, () => {
      console.log(
        `Server running on ${getBaseUrl()} on PORT 5050, ENV: ${getEnvironment()}`
      );
    });
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
