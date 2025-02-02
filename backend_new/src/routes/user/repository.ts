import db from '../../db';
import { errs } from '../../utils/catch-error';
import { eq } from 'drizzle-orm';
import { user } from '../../models/user';
import { User } from '../../types';
import bcrypt from 'bcrypt';

export async function getAllUsers(role:string,accessTo:string) {
    try {
        if(role!=='admin' && accessTo!=='all'){
            throw new Error('No User data');
        }
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


export async function getUser(role:string,accessTo:string,userId: string) {
    try {
        if(role!=='admin' && accessTo!=='all'){
            throw new Error('No User data');
        }
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



export async function deleteUser(role:string,accessTo:string,userId: string) {
    try {
        if(role!=='admin' && accessTo!=='all'){
            throw new Error('No User data');
        }
        const user1 = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, userId),
            columns: {
                password: false,
            },
        });
        if (!user1) {
            throw new Error('User not found');
        }
        return await db.delete(user).where(eq(user.id, userId));
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}


export async function changePassword(role:string,accessTo:string,userId: string,password: string) {
    try {
        if(role!=='admin' && accessTo!=='all'){
            throw new Error('No User data');
        }
        const user1 = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, userId),
            columns: {
                password: false,
            },
        });
        if (!user1) {
            throw new Error('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(user).set({ password: hashedPassword }).where(eq(user.id, userId));
        return user1;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}




export async function getUserProfile(userId: string) {
    try {
        console.log('userId', userId);
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
