export class Flashcard {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public topicId: number,
        public creatorId: number,
        public title: string,
        public question: string,
        public answer: string,
        public tags: string[],
        public difficulty: string,
        public lastReviewed: Date,
        public reviewCount: number
    ) { }
}

export type FlashcardGenerate = {
    files?: { base64: string }[];
    link?: string;
    text?: string;
    topic?: string;
}