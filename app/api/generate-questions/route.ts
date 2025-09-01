import { NextRequest, NextResponse } from 'next/server'
import { FlashCard, QuestionGenerationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: QuestionGenerationRequest = await request.json()
    const { content, numQuestions, difficulty, questionTypes } = body

    if (!content || !numQuestions) {
      return NextResponse.json(
        { error: 'Content and number of questions are required' },
        { status: 400 }
      )
    }

    // Generate questions locally without external API calls
    const questions = generateQuestionsLocally(content, numQuestions, difficulty, questionTypes)
    
    // Add metadata to each question
    const flashCards: FlashCard[] = questions.map((q, index) => ({
      id: `card-${Date.now()}-${index}`,
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
      difficulty,
      category: 'Generated',
      lastReviewed: undefined,
      isCorrect: undefined
    }))

    return NextResponse.json({
      questions: flashCards,
      totalGenerated: flashCards.length
    })

  } catch (error) {
    console.error('Error generating questions:', error)
    
    // Provide more detailed error information
    let errorMessage = 'Failed to generate questions'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateQuestionsLocally(
  content: string, 
  numQuestions: number, 
  difficulty: string, 
  questionTypes: string[]
): Array<{question: string, answer: string, explanation?: string}> {
  const questions: Array<{question: string, answer: string, explanation?: string}> = []
  
  // Extract key concepts from content
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const words = content.toLowerCase().match(/\b\w{4,}\b/g) || []
  const uniqueWords = Array.from(new Set(words)).filter(word => word.length > 4)
  
  // Generate questions based on content
  for (let i = 0; i < numQuestions; i++) {
    const questionType = questionTypes[i % questionTypes.length]
    let question: string
    let answer: string
    let explanation: string | undefined
    
    switch (questionType) {
      case 'multiple-choice':
        if (sentences.length > 0) {
          const sentence = sentences[i % sentences.length].trim()
          question = `What is the main idea of the following statement: "${sentence}"?`
          answer = "The main idea needs to be identified from the context of the document."
          explanation = "This question tests comprehension of the main concepts in the text."
        } else {
          question = `What is the primary topic discussed in this document?`
          answer = "The document covers various topics that need to be identified based on the content."
          explanation = "This is a general comprehension question to test understanding of the main subject matter."
        }
        break
        
      case 'true-false':
        if (uniqueWords.length > 0) {
          const word = uniqueWords[i % uniqueWords.length]
          question = `True or False: The term "${word}" is mentioned in this document.`
          answer = uniqueWords.includes(word) ? "True" : "False"
          explanation = "This question tests attention to detail and recall of specific terms."
        } else {
          question = "True or False: This document contains educational content suitable for exam preparation."
          answer = "True"
          explanation = "Documents uploaded for flash card generation are typically study materials."
        }
        break
        
      case 'fill-in-blank':
        if (sentences.length > 0) {
          const sentence = sentences[i % sentences.length].trim()
          const words = sentence.split(' ')
          if (words.length > 3) {
            const blankIndex = Math.floor(words.length / 2)
            const blankWord = words[blankIndex]
            const questionText = words.map((word, idx) => idx === blankIndex ? '_____' : word).join(' ')
            question = `Fill in the blank: "${questionText}"`
            answer = blankWord
            explanation = "This question tests vocabulary and context understanding."
          } else {
            question = "Fill in the blank: The purpose of this document is to provide _____ for learning."
            answer = "content"
            explanation = "Documents serve as source material for generating educational questions."
          }
        } else {
          question = "Fill in the blank: The purpose of this document is to provide _____ for learning."
          answer = "content"
          explanation = "Documents serve as source material for generating educational questions."
        }
        break
        
      default:
        question = `What is the main topic discussed in the document?`
        answer = "The document covers various topics that need to be identified based on the content."
        explanation = "This is a general comprehension question to test understanding of the main subject matter."
    }
    
    questions.push({ question, answer, explanation })
  }
  
  return questions
}
