import {Request, Response} from "express";

export default interface BookmarkControllerI {
    findAllBookmarksForUser  (req: Request, res: Response): void;
    addBookmark  (req: Request, res: Response): void;
    deleteBookmark  (req: Request, res: Response): void;
}