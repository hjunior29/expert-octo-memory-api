import { PasswordService } from "$core/security/password.service";
import { UtilsService } from "$modules/utils/utils.service";
import { UserService } from "./user.service";

export class UserController {
	private readonly userService = new UserService();
	private readonly passwordService = new PasswordService();
	private readonly utilsService = new UtilsService();

	getAllUsers = async () => {
		const users = await this.userService.findAll();
		return users
			? this.utilsService.createResponse(201, "Usuários encontrados", users)
			: this.utilsService.createResponse(404, "Nenhum usuário encontrado");
	};

	getUser = async (req: Request & { params: { id: string } }) => {
		const id = Number(req.params.id);

		if (!id) {
			return this.utilsService.createResponse(400, "Erro no corpo da requisição");
		}

		const user = await this.userService.findById({ id });
		return user
			? this.utilsService.createResponse(201, "Usuário encontrado", user)
			: this.utilsService.createResponse(404, "Usuário não encontrado");
	};

	createUser = async (req: Request) => {
		const data = await req.json();

		if (
			!data?.firstName ||
			!data?.lastName ||
			!data?.email ||
			!data?.password
		) {
			return this.utilsService.createResponse(400, "Erro no corpo da requisição");
		}

		data.hashedPassword = await this.passwordService.hashPassword(data.password);

		const user = await this.userService.create(data);
		return user
			? this.utilsService.createResponse(201, "Usuário criado", user)
			: this.utilsService.createResponse(400, "Erro ao criar usuário");
	};

	updateUser = async (req: Request & { params: { id: string } }) => {
		const id = Number(req.params.id);

		if (!id) {
			return this.utilsService.createResponse(400, "Erro no corpo da requisição");
		}

		const updatedData = await req.json();
		const updatedUser = await this.userService.update({ id, ...updatedData });
		return updatedUser
			? this.utilsService.createResponse(201, "Usuário atualizado", updatedUser)
			: this.utilsService.createResponse(404, "Usuário não encontrado");
	};

	deleteUser = async (req: Request & { params: { id: string } }) => {
		const id = Number(req.params.id);

		if (!id) {
			return this.utilsService.createResponse(400, "Erro no corpo da requisição");
		}

		const deleted = await this.userService.delete({ id });
		return deleted
			? this.utilsService.createResponse(200, "Usuário deletado")
			: this.utilsService.createResponse(404, "Usuário não encontrado");
	};
}