import {Request, Response} from "express";

export let root = (req: Request, res: Response) => {
  res.send({success: true, data: {message: "API Root"}});
};