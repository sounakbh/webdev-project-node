/**
 * @file Controller RESTful Web service API for likes resource
 */
import {Express, Request, Response} from "express";
import MovieDislikeDao from "../daos/MovieDislikeDao";
import MovieDislikeControllerI from "../interfaces/MovieDislikeControllerI";
import MovieDao from "../daos/MovieDao";

/**
 * @class MovieDislikeController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/movies/dislikes - to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/movies/:mid/dislikes - to retrieve all users that liked a tuit
 *     </li>
 *     <li>PUT /api/movies/users/:uid/dislikes/:movieId - to record that a user likes a tuit
 *     </li>
 * </ul>
 * @property {MovieDislikeDao} movieDislikeDao Singleton DAO implementing likes CRUD operations
 * @property {MovieDislikeController} MovieDislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class MovieDislikeController implements MovieDislikeControllerI {
    private static movieDislikeDao: MovieDislikeDao = MovieDislikeDao.getInstance();
    private static movieDao: MovieDao = MovieDao.getInstance();
    private static movieDislikeController: MovieDislikeController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MovieDislikeController
     */
    public static getInstance = (app: Express): MovieDislikeController => {
        if(MovieDislikeController.movieDislikeController === null) {
            MovieDislikeController.movieDislikeController = new MovieDislikeController();
            app.get("/api/users/:uid/movies/dislikes", MovieDislikeController.movieDislikeController.findAllOmdbMoviesDislikedByUser);
            app.get("/api/movies/:mid/dislikes", MovieDislikeController.movieDislikeController.findAllUsersThatDislikedMovie);
            app.put("/api/movies/users/:uid/dislikes/:movieId", MovieDislikeController.movieDislikeController.userTogglesMovieDislikes);
        }
        return MovieDislikeController.movieDislikeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatDislikedMovie = (req: Request, res: Response) => {
        MovieDislikeController.movieDislikeDao.findAllUsersThatDislikedMovie(req.params.mid)
            .then(dislikes => res.json(dislikes));
    }

    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllOmdbMoviesDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : null;

        if (userId === null) {
            res.status(503).send("User needs to be logged in!")
            return;
        }

        MovieDislikeController.movieDislikeDao.findAllMoviesDislikedByUser(userId)
            .then(async dislikes => {
                const likesNonNullMovies = dislikes.filter(dislike => dislike.movie);
                const moviesFromDisLikes = likesNonNullMovies.map(dislike => dislike.movie);
                const finalMovies = moviesFromDisLikes.map((item) => item.movieId);
                res.json(finalMovies);
            });
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userTogglesMovieDislikes = async (req: Request, res: Response) => {
        const movieDislikeDao = MovieDislikeController.movieDislikeDao;
        const movieDao = MovieDislikeController.movieDao;
        const uid = req.params.uid;
        const movieId = req.params.movieId;

        let mid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : null;
        if (userId === null) {
            res.status(503).send("User needs to be logged in!")
            return;
        }

        try {
            const movie = await movieDao.findMovieByOmdbId(movieId);
            if(movie){
                mid = movie._id;
            } else {
                const stats = {
                    likes: 0,
                    dislikes: 0
                }
                await movieDao.createMovie({movieId, stats});
                const newMovie = await movieDao.findMovieByOmdbId(movieId);
                mid = newMovie._id;
            }

            const userAlreadyDislikedMovie = await movieDislikeDao.findUserDislikesMovie(userId, mid);
            const howManyDislikedMovie = await movieDislikeDao.countHowManyDislikedMovie(mid);
            const selectedMovie = await movieDao.findMovieById(mid);
            if (userAlreadyDislikedMovie) {
                await movieDislikeDao.userRemovesDislikesMovie(userId, mid);
                selectedMovie.stats.dislikes = howManyDislikedMovie - 1;
            } else {
                await MovieDislikeController.movieDislikeDao.userDislikesMovie(userId, mid);
                selectedMovie.stats.dislikes = howManyDislikedMovie + 1;
            }
            await movieDao.updateLikes(mid, selectedMovie.stats);
            console.log(selectedMovie);
            res.json(selectedMovie);
        } catch (e) {
            res.sendStatus(404).send("Error in toggling likes!");
        }
    }
};