import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { promisify } from 'util';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { FlashCard } from '@/types'

// OpenRouter configuration - using free models only
const OPENROUTER_API_KEY = process.env.OPENROUTER_// filepath: c:\Users\Vortex\FLASH-CARD-2.0-WITH-SHI-WEI\app\api\generate-questions\route.ts
export const runtime = 'nodejs';

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
    // Parse multipart form data
    const form = formidable();
    const parseForm = promisify(form.parse.bind(form));

    // Get raw request body as a stream
    const req = request as unknown as { req: any };
    const [fields, files] = await parseForm(req.req);

    const file = files.file?.[0];  // formidable v4 returns an array
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read and parse PDF
    const buffer = await fs.promises.readFile(file.filepath);
    let textContent = '';
    
    try {
      const pdfData = await pdfParse(buffer);
      textContent = pdfData.text;
    } catch (err) {
      console.error('PDF parse error:', err);
      return NextResponse.json(
        { error: 'Failed to parse PDF' },
        { status: 400 }
      );
    }

    // Generate questions
    const numQuestions = 5;
    const difficulty = 'medium';
    const questionTypes = ['multiple-choice', 'true-false', 'fill-in-blank'];

    const questions = generateQuestionsLocally(textContent, numQuestions, difficulty, questionTypes);

    // Convert to flash cards
    const flashCards: FlashCard[] = questions.map((q, index) => ({
      id: `card-${Date.now()}-${index}`,
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
      difficulty,
      category: 'Generated',
      lastReviewed: undefined,
      isCorrect: undefined
    }));

    // Clean up temporary file
    await fs.promises.unlink(file.filepath);

    // Return response
    return NextResponse.json({
      questions: flashCards,
      totalGenerated: flashCards.length
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
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
