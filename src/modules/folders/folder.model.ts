export class Folder {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public creatorId: number,
        public name: string,
    ) { }
}