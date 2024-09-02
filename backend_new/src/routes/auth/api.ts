import express from 'express';
import { catchError } from '../../utils/catch-error';
import handleValidationError from '../../utils/handle-validation-error';
import { createAccessToken, createRefreshToken, createUser, verifyLogin } from './repository';
import { loginSchema, userSchema } from './schema';
import cookie from 'cookie';


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


        const accessToken = createAccessToken(user.id, user.empId);
        const refreshToken = createRefreshToken(user.id, user.empId);
        const date = new Date();

        date.setFullYear(date.getFullYear() + 1);

        res.setHeader(
            'Set-Cookie',
            cookie.serialize('refreshToken', refreshToken, {
                httpOnly: true,
                expires: date,
                sameSite: 'strict',
                secure: false,
                path: '/',
                domain: 'localhost',
            }),
             );

        res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: "/",
                domain: 'localhost',
        })

        res.status(200).send({
                message: 'Successfully logged in',
                data: user,
                token: accessToken,
        });

    } catch (error) {
        res.status(500).send('Something went wrong logging you in');
    }
});



Router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const { error } = userSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            console.log("error",error)
            return handleValidationError(error, res);
        }
        const userData = await createUser(data);
        res.status(201).send({
            message:'Created Successfully'
        });
    } catch (error) {
        console.log("catch error",error)
        catchError(error, res);
    }
});


Router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('accessToken').status(200).send({
            message: 'Successfully logged out',
        });
    } catch (error) {
        console.log("catch error",error)
        catchError(error, res);
    }
});




export default Router;
