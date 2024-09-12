import { Response } from 'express';
import { ValidationError } from 'joi';

export default function handleValidationError(error: ValidationError, res: Response) {
    console.log('error', error);
    const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message,
    }));

    res.status(500).send("Something went wrong!!");
}
