import { ORIGIN_URL } from "$constants/index";

export class UtilsService {
    createResponse(status: number, message?: string, data?: unknown) {
        return new Response(
            JSON.stringify({
                status,
                ...(message && { message }),
                ...(data !== undefined && { data })
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": ORIGIN_URL ?? "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                },
                status,
            }
        );
    }

    base64ToFile(base64: string, fileName: string): File {
        const arr = base64.split(',');
        const mimeRegex = /:(.*?);/;
        const mimeMatch = mimeRegex.exec(arr[0]);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const byteString = atob(arr[1]);
        const uint8Array = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new File([uint8Array], fileName, { type: mime });
    }

    generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
}