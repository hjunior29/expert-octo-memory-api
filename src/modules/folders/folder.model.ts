export class Folder {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public name: string,
        public creatorId: number,
    ) { }
}