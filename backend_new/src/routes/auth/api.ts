import express from 'express';
import { catchError } from '../../utils/catch-error';
import handleValidationError from '../../utils/handle-validation-error';
import { checkUser, createAccessToken, createRefreshToken, createUser, verifyLogin, verifyToken } from './repository';
import { loginSchema, userSchema } from './schema';
import db from '../../db';
import { user } from '../../models/user';
import { eq } from 'drizzle-orm';
// import cookie from 'cookie';
// import authenticateUser from '../../middleware/authenticate-user';

const Router = express.Router();

Router.post('/login', async (req, res) => {
    try {
        const { empId, password } = req.body;
        const { error } = loginSchema.validate({ empId, password }, { abortEarly: false });

        if (error) {
            return handleValidationError(error, res);
        }

        const user = await verifyLogin(empId, password);
        if (!user) {
            return res.status(401).send('Invalid Username or Password');
        }

        const accessToken = createAccessToken(
            user.id,
            user.empId,
            user.designation,
            user.name,
            user.role,
            user.accessTo,
        );
        const refreshToken = createRefreshToken(
            user.id,
            user.empId,
            user.designation,
            user.name,
            user.role,
            user.accessTo,
        );
        const date = new Date();

        date.setFullYear(date.getFullYear() + 1);

        // res.setHeader(
        //     'Set-Cookie',
        //     cookie.serialize('refreshToken', refreshToken, {
        //         httpOnly: true,
        //         expires: date,
        //         sameSite: 'strict',
        //         secure: false,
        //         path: '/',
        //         domain: 'localhost',
        //     }),
        //      );
        // //Only for testing
        // // res.cookie("accessToken", accessToken, {
        // //         httpOnly: true,
        // //         secure: true,
        // //         sameSite: 'strict',
        // //         path: "/",
        // //         domain: 'localhost',
        // // })

        res.status(200).send({
            message: 'Successfully logged in',
            data: user,
            token: accessToken,
        });
    } catch (error) {
        console.log('err', error);
        res.status(500).send('Something went wrong logging you in');
    }
});

Router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const { error } = userSchema.validate(data, { abortEarly: false });
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        if (await checkUser(data)) {
            return res.status(400).send({
                message: 'User already Exists!!',
            });
        }
        const userData = await createUser(data);
        res.status(201).send({
            message: 'Created Successfully',
        });
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

Router.post('/verifyToken', async (req, res) => {
    try {
        const data = req.body;
        const access_token = data.access_token;
        console.log('token..', data);
        if (!access_token) {
            throw new Error('Unauthorized');
        }

        const userTokenData = verifyToken(access_token);
        console.log('userData from token', userTokenData);
        let currUser = null;
        if (userTokenData) {
            const result = await db.select().from(user).where(eq(user.id, userTokenData.id));
            if (result.length === 0) {
                throw new Error('Account has been deleted');
            }
            currUser = result[0];
        }
        res.status(200).send({
            message: 'Token verified',
            data:{
                role:currUser?.role,
                accessTo: currUser?.accessTo,
                profileImg: currUser?.profileImg
            }
        });
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

// Router.post('/logout', async (req, res) => {
//     try {
//         res.clearCookie('accessToken').status(200).send({
//             message: 'Successfully logged out',
//         });
//     } catch (error) {
//         console.log("catch error",error)
//         catchError(error, res);
//     }
// });

export default Router;
