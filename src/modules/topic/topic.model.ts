export class Topic {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public folderId: string,
        public name: string,
        public description?: string,
        public sharedId?: string,
    ) { }
}