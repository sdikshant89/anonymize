import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { genResponse } from "@/utils/ResponseGenerator";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return genResponse(false, "User not Authenticated", 401);
        }
        const currUser: User = session?.user as User;
        const userId = new mongoose.Types.ObjectId(currUser._id);
        
        // check for mongoDB aggregation function
        const user = await UserModel.aggregate([
            {$match: { id: userId }},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ]);
        if(!user || user.length === 0){
            return genResponse(false, "user not found", 401);
        }
        return genResponse(true, "messages found", 200, {messages: user[0].messages});
    }catch(err){
        console.log("Error getting messages");
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return genResponse(false, "Error getting messages", 500, null, errorMessage);
    }
}