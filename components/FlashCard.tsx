'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { FlashCard as FlashCardType } from '@/types'

interface FlashCardProps {
  card: FlashCardType
  showAnswer: boolean
  onShowAnswer: () => void
  onAnswerResponse: (isCorrect: boolean) => void
}

export default function FlashCard({ 
  card, 
  showAnswer, 
  onShowAnswer, 
  onAnswerResponse 
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    if (!showAnswer) {
      setIsFlipped(!isFlipped)
      onShowAnswer()
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuestionTypeIcon = (question: string) => {
    if (question.includes('?') && question.includes('A)') && question.includes('B)')) {
      return 'Multiple Choice'
    } else if (question.toLowerCase().includes('true') || question.toLowerCase().includes('false')) {
      return 'True/False'
    } else {
      return 'Fill in the Blank'
    }
  }

  return (
    <div className="relative">
      {/* Card */}
      <motion.div
        className="relative cursor-pointer perspective-1000"
        onClick={handleCardClick}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front of card (Question) */}
        <div className={`card p-8 min-h-[300px] flex flex-col justify-center ${isFlipped ? 'hidden' : 'block'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <QuestionMarkCircleIcon className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-600">
                {getQuestionTypeIcon(card.question)}
              </span>
            </div>
            {card.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                {card.difficulty}
              </span>
            )}
          </div>

          {/* Question */}
          <div className="text-center flex-1 flex items-center justify-center">
            <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
              {card.question}
            </h3>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2 text-primary-600">
              <EyeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Click to reveal answer</span>
            </div>
          </div>
        </div>

        {/* Back of card (Answer) */}
        <div className={`card p-8 min-h-[300px] flex flex-col justify-center ${isFlipped ? 'block' : 'hidden'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Answer</span>
            </div>
            {card.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                {card.difficulty}
              </span>
            )}
          </div>

          {/* Answer */}
          <div className="text-center flex-1 flex items-center justify-center">
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
                {card.answer}
              </h3>
              {card.explanation && (
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Explanation:</p>
                  <p>{card.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Answer Response Buttons */}
          <div className="mt-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-3">How well did you know this?</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => onAnswerResponse(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Incorrect</span>
                </button>
                <button
                  onClick={() => onAnswerResponse(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Correct</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card Shadow */}
      <div className="absolute inset-0 bg-black opacity-5 rounded-xl transform rotate-3 scale-95 -z-10"></div>
    </div>
  )
}
