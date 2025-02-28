import { User } from "./user.model";

export class UserService {
	private users: User[] = [];

	create(name: string, email: string): User {
		const user = new User(this.users.length + 1, name, email);
		this.users.push(user);
		return user;
	}

	findById(id: number): User | undefined {
		return this.users.find((user) => user.id === id);
	}

	findAll(): User[] {
		return this.users;
	}
}
