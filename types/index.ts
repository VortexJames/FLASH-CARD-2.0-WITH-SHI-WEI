export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: string;
  category: string;
  lastReviewed?: Date;
  isCorrect?: boolean;
}

export interface DocumentContent {
  text: string
  filename: string
  fileType: string
}

export interface QuestionGenerationRequest {
  content: string
  numQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  questionTypes: string[]
}

export interface QuestionGenerationResponse {
  questions: FlashCard[]
  totalGenerated: number
}
