'use client'

import { useState } from 'react'
import { Word } from '@/lib/types/database'

interface FlashcardProps {
  word: Word
  onSwipe: (direction: 'left' | 'right') => void
  remainingCount: number
}

export default function Flashcard({ word, onSwipe, remainingCount }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setStartPos({ x: clientX, y: clientY })
  }

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return

    const deltaX = clientX - startPos.x
    const deltaY = clientY - startPos.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      // Swipe tamamlandı
      if (dragOffset.x > 0) {
        onSwipe('right')
      } else {
        onSwipe('left')
      }
    }

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
    setIsFlipped(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  const rotation = dragOffset.x * 0.1
  const opacity = 1 - Math.abs(dragOffset.x) / 200

  return (
    <div className="relative">
      {/* Kalan kelime sayacı */}
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          Kalan: {remainingCount} kelime
        </span>
      </div>

      {/* Swipe yönlendirme göstergeleri */}
      <div className="flex justify-between mb-4 px-8">
        <div
          className={`px-6 py-2 rounded-full text-white font-medium transition-all ${
            dragOffset.x < -50 ? 'bg-red-500 scale-110' : 'bg-red-300'
          }`}
        >
          ❌ Bilmiyorum
        </div>
        <div
          className={`px-6 py-2 rounded-full text-white font-medium transition-all ${
            dragOffset.x > 50 ? 'bg-green-500 scale-110' : 'bg-green-300'
          }`}
        >
          ✓ Biliyorum
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative w-full max-w-md mx-auto h-96 perspective">
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Ön yüz - İngilizce */}
            <div className="absolute inset-0 backface-hidden">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white">
                <p className="text-sm uppercase tracking-wider mb-4 opacity-80">İngilizce</p>
                <h2 className="text-5xl font-bold mb-4">{word.english}</h2>
                <p className="text-sm opacity-70 mt-8">Çevirmek için kartı tıklayın</p>
              </div>
            </div>

            {/* Arka yüz - Türkçe */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white">
                <p className="text-sm uppercase tracking-wider mb-4 opacity-80">Türkçe</p>
                <h2 className="text-5xl font-bold mb-4">{word.turkish}</h2>
                <p className="text-sm opacity-70 mt-8">Geri dönmek için kartı tıklayın</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Butonlar (mobil için) */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={() => onSwipe('left')}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          ❌ Bilmiyorum
        </button>
        <button
          onClick={() => onSwipe('right')}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          ✓ Biliyorum
        </button>
      </div>
    </div>
  )
}

