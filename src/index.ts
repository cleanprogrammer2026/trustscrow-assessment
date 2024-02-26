import http from "http";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import database from "./database";
import { CategoryMap } from "./model";

// Initialize express instance
const app = express();

// Set the express app middlewares & filters.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

// Bind express app into http thread.
const server = http.createServer(app);

// Connect to Postgres Database
database
  .authenticate()
  .then(() => {
    CategoryMap(database);
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

// Start express app server
const port = 4000;
server.listen(port, () => {
  console.log(`API Started on PORT: ${port}`);
});
