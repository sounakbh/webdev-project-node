/**
 * @file Controller RESTful Web service API for likes resource
 */
import {Express, Request, Response} from "express";
import MovieLikeDao from "../daos/MovieLikeDao";
import MovieLikeControllerI from "../interfaces/MovieLikeControllerI";
import MovieDao from "../daos/MovieDao";
/**
 * @class TuitController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {MovieLikeDao} movieLikeDao Singleton DAO implementing likes CRUD operations
 * @property {MovieLikeController} MovieLikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class MovieLikeController implements MovieLikeControllerI {
    private static movieLikeDao: MovieLikeDao = MovieLikeDao.getInstance();
    private static movieDao: MovieDao = MovieDao.getInstance();
    private static movieLikeController: MovieLikeController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): MovieLikeController => {
        if(MovieLikeController.movieLikeController === null) {
            MovieLikeController.movieLikeController = new MovieLikeController();
            app.get("/api/users/:uid/movies", MovieLikeController.movieLikeController.findAllMoviesLikedByUser);
            app.get("/api/movies/:mid/likes", MovieLikeController.movieLikeController.findAllUsersThatLikedMovie);
            app.put("/api/movies/users/:uid/likes/:movieId", MovieLikeController.movieLikeController.userTogglesMovieLikes);
        }
        return MovieLikeController.movieLikeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatLikedMovie = (req: Request, res: Response) =>
        MovieLikeController.movieLikeDao.findAllUsersThatLikedMovie(req.params.mid)
            .then(likes => res.json(likes));

    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllMoviesLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        MovieLikeController.movieLikeDao.findAllMoviesLikedByUser(userId)
            .then(likes => {
                const likesNonNullMovies = likes.filter(like => like.movie);
                const moviesFromLikes = likesNonNullMovies.map(like => like.movie);
                res.json(moviesFromLikes);
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
    userTogglesMovieLikes = async (req: Request, res: Response) => {
        const movieLikeDao = MovieLikeController.movieLikeDao;
        const movieDao = MovieLikeController.movieDao;
        const uid = req.params.uid;
        const movieId = req.params.movieId;

        let mid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
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

            const userAlreadyLikedMovie = await movieLikeDao.findUserLikesMovie(userId, mid);
            const howManyLikedMovie = await movieLikeDao.countHowManyLikedMovie(mid);
            const selectedMovie = await movieDao.findMovieById(mid);
            if (userAlreadyLikedMovie) {
                await movieLikeDao.userUnlikesMovie(userId, mid);
                selectedMovie.stats.likes = howManyLikedMovie - 1;
            } else {
                await MovieLikeController.movieLikeDao.userLikesMovie(userId, mid);
                selectedMovie.stats.likes = howManyLikedMovie + 1;
            }
            await movieDao.updateLikes(mid, selectedMovie.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
};