'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentArrowUpIcon, 
  XMarkIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { FlashCard, DocumentContent } from '@/types'
import toast from 'react-hot-toast'

interface DocumentUploadProps {
  onCardsGenerated: (cards: FlashCard[]) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export default function DocumentUpload({ 
  onCardsGenerated, 
  isGenerating, 
  setIsGenerating 
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<DocumentContent[]>([])
  const [numQuestions, setNumQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple-choice', 'true-false', 'fill-in-blank'])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    // handle response (e.g., show flashcards)
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return await file.text()
    } else if (file.type === 'application/pdf') {
      // Extract text from PDF using PDF.js
      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdfjsLib = await import('pdfjs-dist')
        
        // Set worker source for PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(' ')
          fullText += pageText + '\n'
        }
        
        return fullText.trim()
      } catch (error) {
        console.error('PDF parsing error:', error)
        throw new Error('Failed to parse PDF. Please ensure the file is not corrupted.')
      }
    } else if (file.type.includes('word') || file.type.includes('document') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      // Extract text from Word documents using mammoth
      try {
        const arrayBuffer = await file.arrayBuffer()
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ arrayBuffer })
        return result.value
      } catch (error) {
        console.error('Word document parsing error:', error)
        throw new Error('Failed to parse Word document. Please ensure the file is not corrupted.')
      }
    } else {
      throw new Error('Unsupported file type. Please use text files (.txt), PDF files (.pdf), or Word documents (.doc, .docx).')
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerateQuestions = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one document')
      return
    }

    setIsGenerating(true)
    
    try {
      // Combine all document content
      const combinedContent = uploadedFiles.map(file => file.text).join('\n\n')
      
      // Call the API to generate questions
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: combinedContent,
          numQuestions,
          difficulty,
          questionTypes
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      onCardsGenerated(data.questions)
      toast.success(`Generated ${data.totalGenerated} questions successfully!`)
      
    } catch (error) {
      console.error('Error generating questions:', error)
      toast.error('Failed to generate questions. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const input = fileInputRef.current
      if (input) {
        input.files = files
        handleFileUpload({ target: { files } } as any)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* File Upload Area */}
      <div className="card p-8 mb-8">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors duration-200"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-900 mb-2">
            Drop your documents here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              browse
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Supports text files (.txt), PDF files (.pdf), and Word documents (.doc, .docx)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Documents ({uploadedFiles.length})
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{file.filename}</span>
                  <span className="text-xs text-gray-500">({file.text.length} characters)</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Settings */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <CogIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Generation Settings</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="input-field"
            >
              <option value={5}>5 questions</option>
              <option value={10}>10 questions</option>
              <option value={15}>15 questions</option>
              <option value={20}>20 questions</option>
              <option value={25}>25 questions</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="input-field"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Types
            </label>
            <div className="space-y-2">
              {['multiple-choice', 'true-false', 'fill-in-blank'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={questionTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setQuestionTypes(prev => [...prev, type])
                      } else {
                        setQuestionTypes(prev => prev.filter(t => t !== type))
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {type.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateQuestions}
          disabled={isGenerating || uploadedFiles.length === 0}
          className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Questions...</span>
            </>
          ) : (
            <>
              <span>Generate Flash Cards</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
