import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

type CustomErrorResponse = {
    name: string;
    message: string;
    statusCode?: number;
};

type CustomSuccessResponse = {
    id: string;
};

type EmailResponse = {
    data?: CustomSuccessResponse | null;
    // null added after looking into the implementation
    error?: CustomErrorResponse | null;
};

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        const emailResp : EmailResponse = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymize: Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
          if(emailResp.data && emailResp.data.id){
            return {success: true, message: 'Verify email sent successfully'};    
          }else if(emailResp.error){
            // This could be used to log the response but not to show in ui
            // if not logging remove the else-if part
            // return {success: false, message: emailResp.error.name + ": " + emailResp.error.statusCode + ": " + emailResp.error.message};    
            return {success: false, message: 'Error sending verification email'};    
          }
        return {success: false, message: 'Error sending email'};
    } catch (err) {
        console.error("Error sending verification email", err);
        return {success: false, message: 'Failed to send verify email'};
    }
}