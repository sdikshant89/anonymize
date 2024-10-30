import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { genResponse } from "@/utils/ResponseGenerator";


export async function POST(request: Request){
    await dbConnect();
    try {
        const { username, content } = await request.json();
        const user = await UserModel.findOne({username});
        if(!user){
            return genResponse(false, "User not found", 404);
        }
        if(!user.isAcceptingMessage){
            return genResponse(false, "User not accepting messages", 403);
        }
        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return genResponse(true, "Message saved with user", 200);
    } catch (err) {
        console.log("Error saving message");
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return genResponse(false, "Error saving message", 500, null, errorMessage);
    }
}