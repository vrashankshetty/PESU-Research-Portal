// import { NextFunction, Request, Response } from 'express';

// import { verifyToken } from '../routes/auth/repository';
// import db from '../db';
// import { user } from '../models/user';
// import { eq } from 'drizzle-orm';

// declare module 'express-serve-static-core' {
//     interface Request {
//         user: { id: string; email: string; role: string };
//     }
// }

// export default async function authenticateUser(req: Request, res: Response, next: NextFunction) {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             throw new Error('Unauthorized');
//         }
//         const userTokenData = verifyToken(token);
//         if (userTokenData) {
//             const result = await db.select().from(user).where(eq(user.id, userTokenData.id));
//             if (result.length === 0) {
//                 throw new Error('Account has been deleted');
//             }
//         }
//         //console.log('verifyToken', userTokenData);
//         (req as any).user = userTokenData;
//         next();
//     } catch (e) {
//         return res.status(401).send('Unauthorized');
//     }
// }

// export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
//     authenticateUser(req, res, () => {
//         try {
//             if ((req as any).user.role === 'admin') {
//                 next();
//             } else {
//                 res.status(403).send('Only admin is allowed');
//             }
//         } catch (e) {
//             return res.status(401).send('Unauthorized');
//         }
//     });
// }

// export function authenticateAffiliateUser(req: Request, res: Response, next: NextFunction) {
//     authenticateUser(req, res, () => {
//         if ((req as any).user.role === 'admin' || (req as any).user.role === 'affiliate_user') {
//             next();
//         } else {
//             res.status(403).send('Only affiliate_user is allowed');
//         }
//     });
// }

// export function authenticatePageControls(req: Request, res: Response, next: NextFunction) {
//     authenticateUser(req, res, () => {
//         try {
//             if ((req as any).user.role === 'admin' || (req as any).user.role === 'internal_affiliate_user') {
//                 next();
//             } else {
//                 res.status(403).send('You are not allowed');
//             }
//         } catch (e) {
//             console.log('in authenticate page controls');
//             return res.status(401).send('Unauthorized');
//         }
//     });
// }
