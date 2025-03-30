export class Auth {
    constructor(
        public email: string,
        public password: string,
        public token?: string,
    ) { }
}