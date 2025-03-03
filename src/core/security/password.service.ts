export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        const hash = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 4,
        });
        return hash;
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        const isMatch = await Bun.password.verify(password, hash);
        return isMatch;
    }
}