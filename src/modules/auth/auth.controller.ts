import { AuthService } from "./auth.service";
import { PasswordService } from "$core/security/password.service";
import { UtilsService } from "$modules/utils/utils.service";
import { jwtVerify, SignJWT } from "jose";
import { PRIVATE_KEY, PUBLIC_KEY } from "$constants/index";

export class AuthController {
    private readonly authService = new AuthService();
    private readonly passwordService = new PasswordService();
    private readonly utilsService = new UtilsService();

    login = async (req: Request) => {
        const { email, password } = await req.json();

        const user = await this.authService.findByEmail(email);
        if (!user) {
            return this.utilsService.createResponse(401, "Usuário ou senha inválidos");
        }

        if (!user.hashedPassword) {
            return this.utilsService.createResponse(401, "Usuário ou senha inválidos");
        }

        const isValid = await this.passwordService.verifyPassword(password, user.hashedPassword);
        if (!isValid) {
            return this.utilsService.createResponse(401, "Usuário ou senha inválidos");
        }

        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
        })
            .setProtectedHeader({ alg: "RS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(PRIVATE_KEY);
        return this.utilsService.createResponse(200, "Login bem-sucedido", { token });
    };

    verify = async (req: Request) => {
        const authHeader = req.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return this.utilsService.createResponse(401, "Token não informado");
        }

        const token = authHeader.replace("Bearer", "").trim();

        try {
            const { payload } = await jwtVerify(token, PUBLIC_KEY, {
                algorithms: ["RS256"]
            });

            return this.utilsService.createResponse(200, "Token válido", { payload });
        } catch (err) {
            return this.utilsService.createResponse(401, "Token inválido ou expirado");
        }
    };
}