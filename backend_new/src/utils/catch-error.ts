import { Response } from 'express';

export function catchError(error: unknown, res: Response) {
    let message: string;

    //console.log('error', error);

    if (error instanceof Error) {
        message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = 'Something went wrong';
    }
    
    return res.status(500).send(message);
}

export function errs(error: unknown){
    //console.log("in errs",error);
    throw new Error(`Something went wrong!!`);
}
