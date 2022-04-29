import {Request, Response} from "express";

export default interface MovieControllerI {
    findAllMovies (req: Request, res: Response): void;
    findMovieById (req: Request, res: Response): void;
    findMovieByOmdbId (req: Request, res: Response): void;
    createMovie (req: Request, res: Response): void;
    updateMovie (req: Request, res: Response): void;
    deleteMovie (req: Request, res: Response): void;
};