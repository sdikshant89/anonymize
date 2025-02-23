import { z } from "zod";

export const signInSchema = z.object({
    // username or email is identifier
    email: z.string(),
    password: z.string(),
});