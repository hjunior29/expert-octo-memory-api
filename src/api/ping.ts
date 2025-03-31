import { UtilsService } from "$modules/utils/utils.service"

const utilsService = new UtilsService();

export const ping = {
    "/api/ping": {
        GET: async () =>
            utilsService.createResponse(200, "pong"),
    }
}