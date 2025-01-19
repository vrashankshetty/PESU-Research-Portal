import { eq } from "drizzle-orm";
import db from "../../db";
import { user } from "../../models/user";
import { User } from "../../types";
import { errs } from "../../utils/catch-error";
import { generateRandomId } from "../../utils/generate-id";
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECREY_KEY = process.env.JWT_SECRET_KEY as Secret;

export async function getUser(empId: string) {
    const userData = await db.query.user.findFirst({
        where:eq(user.empId,empId)
    })
    return userData;
}


export async function verifyLogin(empId: string, password_user: string) {
    const foundUser = await getUser(empId);
    if (!foundUser) {
        return null;
    }
    const validPassword = await bcrypt.compare(password_user, foundUser.password);
    const { password, ...rest } = foundUser;
    return validPassword ? rest : null;
}



export function createAccessToken(id: string, empId: string,designation: string,name:string,role:string,accessTo:string) {
    const payload = { id, empId, designation,name,role,accessTo};
    const token = jwt.sign(payload, JWT_SECREY_KEY, { expiresIn: '1d' });
    return token;
}

export function createRefreshToken(id: string, empId:string,designation:string,name:string,role:string,accessTo:string) {
    const payload = { id, empId, designation,name,role,accessTo};
    const token = jwt.sign(payload, JWT_SECREY_KEY, { expiresIn: '360d' });
    return token;
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECREY_KEY) as { id: string; empId:string, designation: string,name:string,role:string,accessTo:string };
}



export async function createUser(userData:User) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const {password,...expData}=userData;

    try {
        const currUser = await db.query.user.findMany({
            where:eq(user.empId,expData.empId)
        })
        if(currUser.length != 0){
            throw new Error('User already exists!!')
        }
        const data = await db.insert(user).values({
            id:generateRandomId(),
            password:hashedPassword,
            ...expData
        }).returning();
        return data;
    } catch (error) {
        console.log("err in rep",error)
        errs(error);
    }
}



export async function checkUser(userData:User) {
    const {password,...expData}=userData;

    try {
        const currUser = await db.query.user.findMany({
            where:eq(user.empId,expData.empId)
        })
        if(currUser.length != 0){
            return true;
        }
        return false;
    } catch (error) {
        console.log("err in rep",error)
        errs(error);
    }
}
