import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../routes/auth/repository';
import db from '../db';
import { user } from '../models/user';
import { eq } from 'drizzle-orm';



export default async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies['accessToken'];
        console.log("token..",token)
        if (!token) {
            throw new Error('Unauthorized');
        }
        
        const userTokenData = verifyToken(token);
        console.log("userData from token",userTokenData)
        if (userTokenData) {
            const result = await db.select().from(user).where(eq(user.id, userTokenData.id));
            if (result.length === 0) {
                throw new Error('Account has been deleted');
            }
        }
        (req as any).user = userTokenData;
        next();
    } catch (e) {
        return res.status(401).send('Unauthorized');
    }
}


export async function authenticateChairPerson(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = (req as any).user;
        if(userData.role !== 'chair_person') {
            return res.status(403).send('Forbidden');
        }
        next();
    } catch (e) {
        return res.status(401).send('Unauthorized');
    }
}

