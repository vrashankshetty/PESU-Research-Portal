
import db from '../../db';
import { errs } from '../../utils/catch-error';



export async function getAllUsers() {
    try {
        const users =  await db.query.user.findMany({
          columns:{
            password:false
          }
         })
        return users;
    } catch (error) {
        console.log("err in repo",error)
        errs(error);
    }
}


