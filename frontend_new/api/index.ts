
import axios from "axios";
import { backendUrl } from "@/config";


export const verifyToken = async (token: string) => {
    try {
        const response = await axios.post(   
            `${backendUrl}/api/v1/auth/verifyToken`,
            { access_token: token },
        );
        return response;
    } catch (error) {
        return { status: 401 };
    } 
};