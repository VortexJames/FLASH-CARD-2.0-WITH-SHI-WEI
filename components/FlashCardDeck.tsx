'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { FlashCard } from '@/types'
import FlashCardComponent from './FlashCard'

interface FlashCardDeckProps {
  cards: FlashCard[]
  onBackToUpload: () => void
}

export default function FlashCardDeck({ cards, onBackToUpload }: FlashCardDeckProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: cards.length
  })

  const currentCard = cards[currentCardIndex]
  const isLastCard = currentCardIndex === cards.length - 1

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleAnswerResponse = (isCorrect: boolean) => {
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1)
    }))

    // Mark the card as reviewed
    const updatedCards = [...cards]
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      isCorrect,
      lastReviewed: new Date()
    }

    // Move to next card after a short delay
    setTimeout(() => {
      if (!isLastCard) {
        handleNextCard()
      }
    }, 1000)
  }

  const resetStudySession = () => {
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setStudyStats({
      correct: 0,
      incorrect: 0,
      total: cards.length
    })
  }

  const progressPercentage = (currentCardIndex / cards.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToUpload}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to Upload</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ChartBarIcon className="h-4 w-4" />
            <span>{studyStats.correct} correct</span>
            <span>•</span>
            <span>{studyStats.incorrect} incorrect</span>
          </div>
          
          <button
            onClick={resetStudySession}
            className="btn-secondary text-sm"
          >
            Reset Session
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentCardIndex + 1} of {cards.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Flash Card */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <FlashCardComponent
              card={currentCard}
              showAnswer={showAnswer}
              onShowAnswer={() => setShowAnswer(true)}
              onAnswerResponse={handleAnswerResponse}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousCard}
          disabled={currentCardIndex === 0}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Card {currentCardIndex + 1} of {cards.length}
          </p>
          {showAnswer && (
            <p className="text-xs text-gray-500 mt-1">
              {currentCard.isCorrect !== undefined ? (
                currentCard.isCorrect ? (
                  <span className="text-green-600 flex items-center justify-center space-x-1">
                    <CheckIcon className="h-3 w-3" />
                    <span>Correct!</span>
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center justify-center space-x-1">
                    <XMarkIcon className="h-3 w-3" />
                    <span>Incorrect</span>
                  </span>
                )
              ) : (
                "Rate your answer above"
              )}
            </p>
          )}
        </div>

        <button
          onClick={handleNextCard}
          disabled={isLastCard}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Study Summary */}
      {isLastCard && showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 card p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Study Session Complete! 🎉
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{studyStats.correct}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{studyStats.incorrect}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {Math.round((studyStats.correct / studyStats.total) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={resetStudySession}
              className="btn-primary"
            >
              Study Again
            </button>
            <button
              onClick={onBackToUpload}
              className="btn-secondary"
            >
              Upload New Documents
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
