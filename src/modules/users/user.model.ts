export class User {
	constructor(
		public id: number,
		public createdAt: Date,
		public updatedAt: Date,
		public deletedAt: Date,
		public firstName: string,
		public lastName: string,
		public email: string,
		public phoneNumber: string,
		public hashedPassword: string,
	) { }
}
