/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
import express, { Request, Response } from "express";
import CourseController from "./controllers/CourseController";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import LikeController from "./controllers/LikeController";
import DislikeController from "./controllers/DislikeController";
import SessionController from "./controllers/SessionController";
import AuthenticationController from "./controllers/AuthenticationController";
import mongoose from "mongoose";
import GroupController from "./controllers/GroupController";
import MovieController from "./controllers/MovieController";
import MovieLikeController from "./controllers/MovieLikeController";
import BookmarkController from "./controllers/BookmarkController";
import MovieDislikeController from "./controllers/MovieDislikeController";

const cors = require("cors");
const session = require("express-session");

// build the connection string
const PROTOCOL = "mongodb+srv";
const DB_USERNAME = process.env.DB_USERNAME
  ? process.env.DB_USERNAME
  : "sounakbh";
const DB_PASSWORD = process.env.DB_PASSWORD
  ? process.env.DB_PASSWORD
  : "newpassword";
const HOST = "cluster0.xlyh2.mongodb.net";
const DB_NAME = "myFirstDatabase";
const DB_QUERY = "retryWrites=true&w=majority";
const connectionString = `${PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${HOST}/${DB_NAME}?${DB_QUERY}`; // connect to the database

mongoose
  .connect(connectionString)
  .then((_) => console.log("Connected!"))
  .catch((e) => console.log("Auth failed"));

const app = express();
app.use(
  cors({
    credentials: true,
    // origin: process.env.CORS_ORIGIN,
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN
      : "http://localhost:3000",
  })
);

let sess = {
  secret: process.env.EXPRESS_SESSION_SECRET
    ? process.env.EXPRESS_SESSION_SECRET
    : "Ssdsd@#e$#Rfe@#$d#$#",
  saveUninitialized: true,
  resave: true,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
}

app.use(session(sess));
app.use(express.json());

app.get("/", (req: Request, res: Response) => res.send("Welcome!"));

app.get("/add/:a/:b", (req: Request, res: Response) =>
  res.send(req.params.a + req.params.b)
);

// create RESTful Web service API
const courseController = new CourseController(app);
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likesController = LikeController.getInstance(app);
const dislikeController = DislikeController.getInstance(app);
const movieController = MovieController.getInstance(app);
const movieLikeController = MovieLikeController.getInstance(app);
const movieDislikeController = MovieDislikeController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
SessionController(app);
AuthenticationController(app);
GroupController(app);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
