import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from 'zod';

// This sets the rule to check the username (function defined in schema)
// Now it looks like of no use but in this z.object we can write multiple validations together
const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request){
    await dbConnect();
    try {
        // the name of var has to be searchParam
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        // Validation with ZOD
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length>0?usernameErrors.join(","): "Invalid username format",
            },{status: 400});
        }
        const { username } = result.data;
        const exisitingVerifiedUser = await UserModel.findOne({ username, isVerified: true});
        if(exisitingVerifiedUser){
            return Response.json({
                success: false,
                message: "username already taken"
            },{status: 409});
        }
        return Response.json({
            success: true,
            message: "username available"
        },{status: 200});

    } catch (err) {
        console.error('Error checking for user', err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return Response.json({
            success: false,
            message: "Error checking user",
            error: errorMessage
        },{status: 500});
    }
}