import { z } from "zod";

export const signInSchema = z.object({
    // username or email is identifier
    identifier: z.string(),
    password: z.string(),
});