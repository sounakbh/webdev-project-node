import {Request, Response} from "express";

export default interface MovieLikeControllerI {
    findAllUsersThatLikedMovie (req: Request, res: Response): void;
    findAllMoviesLikedByUser (req: Request, res: Response): void;
    userTogglesMovieLikes (req: Request, res: Response): void;
};