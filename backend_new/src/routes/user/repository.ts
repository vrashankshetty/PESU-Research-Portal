import db from '../../db';
import { errs } from '../../utils/catch-error';

export async function getAllUsers() {
    try {
        const users = await db.query.user.findMany({
            columns: {
                password: false,
            },
        });
        return users;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, userId),
            columns: {
                password: false,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}
