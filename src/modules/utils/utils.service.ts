export class UtilsService {
    createResponse(status: number, message?: string, data?: unknown) {
        return new Response(
            JSON.stringify({
                status,
                ...(message && { message }),
                ...(data !== undefined && { data })
            }),
            {
                headers: { "Content-Type": "application/json" },
                status,
            }
        );
    }
}