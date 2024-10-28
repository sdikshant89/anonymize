import { Resend } from 'resend';

console.log(process.env.RESEND_API_KEY);
if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable");
}
export const resend = new Resend(process.env.RESEND_API_KEY);