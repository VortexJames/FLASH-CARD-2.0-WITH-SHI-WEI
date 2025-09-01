import { NextRequest, NextResponse } from 'next/server'
import { FlashCard, QuestionGenerationRequest } from '@/types'

// OpenRouter configuration - using free models only
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// Free models available on OpenRouter
const FREE_MODELS = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'microsoft/phi-3-mini-4k-instruct:free',
  'nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free'
]

// Function to get a random free model
function getRandomFreeModel(): string {
  return FREE_MODELS[Math.floor(Math.random() * FREE_MODELS.length)]
}

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

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    // Create the prompt for question generation
    const prompt = createQuestionGenerationPrompt(content, numQuestions, difficulty, questionTypes)
    
    // Select a free model
    const selectedModel = getRandomFreeModel()

    // Make request to OpenRouter
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // Update this for production
        'X-Title': 'FlashCard App'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are an expert educator who creates high-quality, objective questions for exam preparation. Generate questions that are clear, accurate, and test understanding of the material."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter API error:', errorData)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const completion = await response.json()
    const responseContent = completion.choices?.[0]?.message?.content

    if (!responseContent) {
      throw new Error('No response from OpenRouter')
    }

    // Parse the response to extract questions
    const questions = parseQuestionsFromResponse(responseContent, numQuestions)
    
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
      totalGenerated: flashCards.length,
      modelUsed: selectedModel
    })

  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}

function createQuestionGenerationPrompt(
  content: string, 
  numQuestions: number, 
  difficulty: string, 
  questionTypes: string[]
): string {
  const difficultyDescription = {
    easy: 'basic understanding and recall',
    medium: 'comprehension and application',
    hard: 'analysis, synthesis, and evaluation'
  }

  const typeDescriptions = {
    'multiple-choice': 'multiple choice questions with 4 options (A, B, C, D)',
    'true-false': 'true/false questions',
    'fill-in-blank': 'fill-in-the-blank questions'
  }

  const selectedTypes = questionTypes.map(type => typeDescriptions[type as keyof typeof typeDescriptions]).join(', ')

  return `Based on the following content, generate ${numQuestions} ${difficulty} difficulty questions that test ${difficultyDescription[difficulty as keyof typeof difficultyDescription]}.

Question types to include: ${selectedTypes}

Content:
${content.substring(0, 3000)}${content.length > 3000 ? '...' : ''}

Please format your response as follows:
Q1: [Question text]
A1: [Answer]
E1: [Brief explanation if helpful]

Q2: [Question text]
A2: [Answer]
E2: [Brief explanation if helpful]

And so on...

Make sure the questions are:
- Relevant to the content provided
- Clear and unambiguous
- Appropriate for ${difficulty} difficulty level
- Varied in question types as requested
- Educational and helpful for exam preparation`
}

function parseQuestionsFromResponse(response: string, expectedCount: number): Array<{question: string, answer: string, explanation?: string}> {
  const questions: Array<{question: string, answer: string, explanation?: string}> = []
  
  // Split by question markers
  const questionBlocks = response.split(/Q\d+:/).filter(block => block.trim())
  
  for (const block of questionBlocks) {
    if (questions.length >= expectedCount) break
    
    const lines = block.trim().split('\n').filter(line => line.trim())
    if (lines.length < 2) continue
    
    const question = lines[0].trim()
    const answer = lines[1].replace(/^A\d+:\s*/, '').trim()
    const explanation = lines[2]?.replace(/^E\d+:\s*/, '').trim() || undefined
    
    if (question && answer) {
      questions.push({ question, answer, explanation })
    }
  }
  
  // If parsing failed, create fallback questions
  if (questions.length === 0) {
    return createFallbackQuestions(expectedCount)
  }
  
  return questions.slice(0, expectedCount)
}

function createFallbackQuestions(count: number): Array<{question: string, answer: string, explanation?: string}> {
  const fallbackQuestions = [
    {
      question: "What is the main topic discussed in the document?",
      answer: "The document covers various topics that need to be identified based on the content.",
      explanation: "This is a general comprehension question to test understanding of the main subject matter."
    },
    {
      question: "True or False: The information in this document is relevant for exam preparation.",
      answer: "True",
      explanation: "Documents uploaded for flash card generation are typically study materials."
    },
    {
      question: "Fill in the blank: The purpose of this document is to provide _____ for learning.",
      answer: "content",
      explanation: "Documents serve as source material for generating educational questions."
    }
  ]
  
  // Repeat fallback questions if needed
  const questions = []
  for (let i = 0; i < count; i++) {
    const fallback = fallbackQuestions[i % fallbackQuestions.length]
    questions.push({
      ...fallback,
      question: `${fallback.question} (Question ${i + 1})`
    })
  }
  
  return questions
}
