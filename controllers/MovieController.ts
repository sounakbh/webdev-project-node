/**
 * @file Controller RESTful Web service API for tuits resource
 */
import MovieDao from "../daos/MovieDao";
import Movie from "../models/movies/Movie";
import {Express, Request, Response} from "express";
import MovieControllerI from "../interfaces/MovieControllerI";

/**
 * @class MovieController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/tuits to create a new tuit instance for
 *     a given user</li>
 *     <li>GET /api/tuits to retrieve all the tuit instances</li>
 *     <li>GET /api/tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /api/users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>PUT /api/tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /api/tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} movieDao Singleton DAO implementing tuit CRUD operations
 * @property {MovieController} movieController Singleton controller implementing
 * RESTful Web service API
 */
export default class MovieController implements MovieControllerI {
    private static movieDao: MovieDao = MovieDao.getInstance();
    private static movieController: MovieController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MovieController
     */
    public static getInstance = (app: Express): MovieController => {
        if(MovieController.movieController === null) {
            MovieController.movieController = new MovieController();
            app.get("/api/movies", MovieController.movieController.findAllMovies);
            app.get("/api/movies/:mid", MovieController.movieController.findMovieById);
            app.get("/api/movies/omdb/:movieId", MovieController.movieController.findMovieByOmdbId);
            app.post("/api/movies", MovieController.movieController.createMovie);
            app.put("/api/movies/:mid", MovieController.movieController.updateMovie);
            app.delete("/api/movies/:mid", MovieController.movieController.deleteMovie);
        }
        return MovieController.movieController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllMovies = (req: Request, res: Response) =>
        MovieController.movieDao.findAllMovies()
            .then((movies: Movie[]) => res.json(movies));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the user ID
     */
    findMovieById = (req: Request, res: Response) =>
        MovieController.movieDao.findMovieById(req.params.mid)
            .then((movie: Movie) => res.json(movie));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the user ID
     */
    findMovieByOmdbId = (req: Request, res: Response) =>
        MovieController.movieDao.findMovieByOmdbId(req.params.movieId)
            .then((movieId: Movie) => res.json(movieId));

    /**
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createMovie = (req: Request, res: Response) => {
        // @ts-ignore
        MovieController.movieDao.createMovie(req.body)
            .then((movieId: Movie) => res.json(movieId));
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateMovie = (req: Request, res: Response) =>
        MovieController.movieDao.updateMovie(req.params.mid, req.body)
            .then((status) => res.send(status));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a user was successful or not
     */
    deleteMovie = (req: Request, res: Response) =>
        MovieController.movieDao.deleteMovie(req.params.mid)
            .then((status) => res.send(status));
};
