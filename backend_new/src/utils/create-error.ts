import { CustomError } from "../middleware/error-handler";

export async function createError(status: number, message: string) {
    const err = new Error() as CustomError;
    err.status = status;
    err.message = message;
}