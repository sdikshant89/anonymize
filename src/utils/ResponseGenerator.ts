export function genResponse( success: boolean, message: string, statusCode: number = 200, data: unknown = null, error: unknown = null): Response {
    const responseBody: { success: boolean; message: string; data?: unknown; error?: unknown } = {
        success,
        message,
    };
    if (data !== null) {
        responseBody.data = data;
    }
    if (error !== null) {
        responseBody.error = error;
    }
    return new Response(JSON.stringify(responseBody), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' }
    });
}