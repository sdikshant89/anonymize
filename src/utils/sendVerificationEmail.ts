import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymize: Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: false, message: 'Verify email sent successfully'};
    } catch (err) {
        console.error("Error sending verification email", err);
        return {success: false, message: 'Failed to send verify email'};
    }
}