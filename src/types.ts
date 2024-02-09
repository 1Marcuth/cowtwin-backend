import { Request, Response, NextFunction } from "express"

export type Controller = (request: Request, response: Response, next: NextFunction) => any
export type Middleware = (request: Request, response: Response, next: NextFunction) => any