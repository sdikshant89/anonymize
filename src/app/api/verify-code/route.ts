import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { genResponse } from "@/utils/ResponseGenerator";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});
        if(!user){
            return genResponse(false, "User not found", 500);
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
        if(isCodeValid && !isCodeExpired){
            user.isVerified = true;
            await user.save();
            return genResponse(true, "User account verified", 200);
        }else if(isCodeExpired){
            return genResponse(false, "Verification code expired, sign up again to get new code", 400);
        }else{
            return genResponse(false, "Incorrect verification code", 400);
        }
    } catch (err) {
        console.error('Error verifying user', err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return genResponse(false, "Error verifying user", 500, null, errorMessage);
    }
}
