import db from '../../db';
import { errs } from '../../utils/catch-error';
import { eq } from 'drizzle-orm';
import { user } from '../../models/user';
import { User } from '../../types';

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

export async function updateUserProfile(userId: string, userData: Partial<User>) {
    try {
        const existingUser = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, userId),
        });

        if (!existingUser) {
            return { status: 404, message: 'User not found' };
        }

        const [updatedUser] = await db.update(user).set(userData).where(eq(user.id, userId)).returning();

        if (!updatedUser?.id) {
            throw new Error('Error updating user profile');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}
