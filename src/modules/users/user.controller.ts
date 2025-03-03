import { UserService } from "./user.service";

export class UserController {
	private userService = new UserService();

	getAllUsers = async () => {
		const users = await this.userService.findAll();
		return new Response(JSON.stringify(users), {
			headers: { "Content-Type": "application/json" },
		});
	};

	getUser = async (req: Request) => {
		const { searchParams } = new URL(req.url);
		const id = Number(searchParams.get("id"));
		const user = await this.userService.findById(id);
		return user
			? new Response(JSON.stringify(user), {
				headers: { "Content-Type": "application/json" },
			})
			: new Response("User not found", { status: 404 });
	};

	createUser = async (req: Request) => {
		const { firstName, lastName, email, phoneNumber, hashedPassword } =
			await req.json();
		const user = await this.userService.create(
			firstName,
			lastName,
			email,
			phoneNumber,
			hashedPassword
		);
		return new Response(JSON.stringify(user), {
			headers: { "Content-Type": "application/json" },
			status: 201,
		});
	};

	updateUser = async (req: Request) => {
		const { searchParams } = new URL(req.url);
		const id = Number(searchParams.get("id"));
		const updatedData = await req.json();

		const updatedUser = await this.userService.update(id, updatedData);
		return updatedUser
			? new Response(JSON.stringify(updatedUser), {
				headers: { "Content-Type": "application/json" },
			})
			: new Response("User not found", { status: 404 });
	};

	deleteUser = async (req: Request) => {
		const { searchParams } = new URL(req.url);
		const id = Number(searchParams.get("id"));

		const deleted = await this.userService.delete(id);
		return deleted
			? new Response("User deleted successfully", { status: 200 })
			: new Response("User not found", { status: 404 });
	};
}