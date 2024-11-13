import { genResponse } from '@/utils/ResponseGenerator';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function POST(req: Request) {
    var ai_response;
    const randomSeed = Math.floor(Math.random() * 10000);
    try {
        // groq logged in by personal email(mlme@sdss) - via google
        ai_response = await generateText({
            model: groq('gemma2-9b-it'),
            prompt: "Create a JSON object with three engaging open-ended questions for an anonymous social messaging platform like Qooh.me. The questions should be suitable for a diverse audience and not too personal, fostering curiosity. For example, format the output as: { \"questions\": [ \"What's a hobby you've recently started?\", \"If you could have dinner with any historical figure, who would it be?\", \"What's a simple thing that makes you happy?\"]}. Provide only the JSON result with properly formatted brackets and braces.",
            temperature: 0.9,
            seed: randomSeed,
            maxTokens: 800
        });
        const ai_questions = (ai_response as any)?.text || "";
        const que_list: Object = JSON.parse(ai_questions);
        return genResponse(true, "Messages Generated", 200, que_list);
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