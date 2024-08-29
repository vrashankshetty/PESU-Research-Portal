import { NextFunction, Request, Response } from 'express';

export class CustomError extends Error {
    status:number;

    constructor (message:string, status:number) {
        super(message);
        this.status = status;
    }
}

export default function errorHandler(err: Error, _: Request, res: Response, next: NextFunction) {
    const errorStatus = (err as CustomError ).status || 500;
    const errorMessage = err.message || "Something went wrong!";


    res.status(errorStatus).send(errorMessage);
}
