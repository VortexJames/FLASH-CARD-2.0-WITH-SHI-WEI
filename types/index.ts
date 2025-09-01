export interface FlashCard {
  id: string
  question: string
  answer: string
  explanation?: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  isCorrect?: boolean
  lastReviewed?: Date
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
