export class Flashcard {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public title: string,
        public question: string,
        public answer: string,
        public folderId: string,
        public tags: string[],
        public difficulty: string,
        public lastReviewed: Date,
        public reviewCount: number
    ) { }
}