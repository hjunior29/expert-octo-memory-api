import { UserService } from "./user.service";

export class UserController {
    private userService = new UserService();

    getUsers = () => {
        return new Response(JSON.stringify(this.userService.findAll()), {
            headers: { "Content-Type": "application/json" },
        });
    };

    helloWorld = () => {
        return new Response("Hello, world!", {
            headers: { "Content-Type": "text/plain" },
        });
    };

    getUser = (req: Request) => {
        const { searchParams } = new URL(req.url)
        const id = Number(searchParams.get('id'));
        const user = this.userService.findById(id);
        return user
            ? new Response(JSON.stringify(user), {
                headers: { "Content-Type": "application/json" },
            })
            : new Response("User not found", { status: 404 });
    };

    createUser = async (req: Request) => {
        const { name, email } = await req.json();
        const user = this.userService.create(name, email);
        return new Response(JSON.stringify(user), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    };
}
