import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { genResponse } from "@/utils/ResponseGenerator";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Modifying if user is accepting any response/ messages or not
export async function POST(request: Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return genResponse(false, "User not Authenticated", 401);
        }
        // check in auth->options where inside callback -> async session we set user attributes
        const currUser: User = session?.user as User;
        const userId = currUser._id;
        const { acceptMessages } = await request.json();
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, {isAcceptingMessage: acceptMessages}, {new: true}
        );
        if(!updatedUser){
            return genResponse(false, "Failed to update user", 401);    
        }else{
            return genResponse(true, "Message acceptance status updated", 200);
        }
    } catch (err) {
        console.log("Error saving message");
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return genResponse(false, "Error saving message", 500, null, errorMessage);
    }
}

export async function GET(request: Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return genResponse(false, "User not Authenticated", 401);
        }
        const currUser: User = session?.user as User;
        const userId = currUser._id;
        const userFound = await UserModel.findById(userId);
        if(!userFound){
            return genResponse(false, "Failed to find user", 404);    
        }
        return genResponse(true, "Message acceptance status fetched", 200, {isAcceptingMessages: userFound.isAcceptingMessage});
    }catch(err){
        console.log("Error getting user");
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return genResponse(false, "Error getting user", 500, null, errorMessage);
    }
}