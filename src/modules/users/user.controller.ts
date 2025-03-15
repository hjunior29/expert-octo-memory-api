import { PasswordService } from "$core/security/password.service";
import { UtilsService } from "$modules/utils/utils.service";
import { UserService } from "./user.service";

export class UserController {
	private userService = new UserService();
	private passwordService = new PasswordService();
	private utilsService = new UtilsService();

	getAllUsers = async () => {
		const users = await this.userService.findAll();
		return users
			? this.utilsService.createResponse(201, "Usuários encontrados", users)
			: this.utilsService.createResponse(404, "Nenhum usuário encontrado");
	};

	getUser = async (req: Request & { params: { id: string } }) => {
		const id = Number(req.params.id);

		const user = await this.userService.findById(id);
		return user
			? this.utilsService.createResponse(201, "Usuário encontrado", user)
			: this.utilsService.createResponse(404, "Usuário não encontrado");
	};

	createUser = async (req: Request) => {
		const { firstName, lastName, email, phoneNumber, password } = await req.json();

		const hashedPassword = await this.passwordService.hashPassword(password);
		const user = await this.userService.create(
			firstName,
			lastName,
			email,
			phoneNumber,
			hashedPassword
		);
		return this.utilsService.createResponse(201, "Usuário criado", user);
	};

	updateUser = async (req: Request & { params: { id: string } }) => {
		const id = Number(req.params.id);

		const updatedData = await req.json();
		const updatedUser = await this.userService.update(id, updatedData);
		return updatedUser
			? this.utilsService.createResponse(201, "Usuário atualizado", updatedUser)
			: this.utilsService.createResponse(404, "Usuário não encontrado");
	};

	deleteUser = async (req: Request & { params: { id: string } }) => {
		const id = Number(req.params.id);

		const deleted = await this.userService.delete(id);
		return deleted
			? this.utilsService.createResponse(200, "Usuário deletado")
			: this.utilsService.createResponse(404, "Usuário não encontrado");
	};
}