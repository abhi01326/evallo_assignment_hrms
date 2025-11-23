const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// Simple CORS middleware to allow frontend requests during development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.sendStatus(200);
  }
  next();
});
const dbPath = path.join(__dirname, "db", "hrms.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";
    app.listen(port, host, () => {
      console.log(
        `Server Running at http://localhost:${port}/ (bound to ${host})`
      );
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/", (request, response) => {
  response.send("Welcome to the HRMS API");
});

// Import routes
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

// Use routes: mount all API endpoints under /api
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
