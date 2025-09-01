'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentArrowUpIcon, 
  AcademicCapIcon, 
  LightBulbIcon,
  PlayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import DocumentUpload from '@/components/DocumentUpload'
import FlashCardDeck from '@/components/FlashCardDeck'
import { FlashCard } from '@/types'

export default function Home() {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentView, setCurrentView] = useState<'upload' | 'study'>('upload')

  const handleCardsGenerated = (cards: FlashCard[]) => {
    setFlashCards(cards)
    setCurrentView('study')
  }

  const resetApp = () => {
    setFlashCards([])
    setCurrentView('upload')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gradient">
                FlashCard AI
              </h1>
            </div>
            {flashCards.length > 0 && (
              <button
                onClick={resetApp}
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'upload' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Documents into Smart Flash Cards
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your study materials and let AI generate comprehensive, 
                objective questions to help you ace your exams.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentArrowUpIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-gray-600">Support for PDF, Word, and text files</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LightBulbIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Generation</h3>
                <p className="text-gray-600">Smart questions based on your content</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Study & Practice</h3>
                <p className="text-gray-600">Interactive learning experience</p>
              </div>
            </div>

            <DocumentUpload 
              onCardsGenerated={handleCardsGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FlashCardDeck 
              cards={flashCards}
              onBackToUpload={() => setCurrentView('upload')}
            />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 FlashCard AI. Built with Next.js and OpenAI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
