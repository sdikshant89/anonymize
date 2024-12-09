import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { genResponse } from "@/utils/ResponseGenerator";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username, isVerified: true
        });
        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if(existingUserVerifiedByUsername){
            return genResponse(false, "Username already taken", 400);
        }
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return genResponse(false, "User already exists with this email", 400);
            }else{
                const newUsernameUserExists = await UserModel.findOne({username});
                if(newUsernameUserExists){
                    return genResponse(false, "Username already taken", 400);
                }else{
                    const hashedPassword = await bcrypt.hash(password, 10);
                    // Changing the existing (non verified) user's username and password
                    existingUserByEmail.username = username;
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                    await existingUserByEmail.save();
                }
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages:[]
            });
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(
            email, username, verifyCode
        );
        if(!emailResponse.success){
            return genResponse(false, emailResponse.message, 500);
        }
        return genResponse(true, "User registered successfully! Please verify Email", 201);
    } catch (err) {
        console.error('Error registering user', err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return genResponse(false, "Error Registering user", 500, null, errorMessage);
    }
}