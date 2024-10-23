import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, {message: 'Message should be atleast 10 characters long'})
        .max(300, {message: 'Message should be no longer than 300 characters long'})
});