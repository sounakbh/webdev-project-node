import {Request, Response} from "express";

export default interface MovieDislikeControllerI {
    findAllUsersThatDislikedMovie (req: Request, res: Response): void;
    findAllOmdbMoviesDislikedByUser (req: Request, res: Response): void;
    userTogglesMovieDislikes (req: Request, res: Response): void;
};