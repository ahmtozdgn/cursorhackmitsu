'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Word } from '@/lib/types/database'
import Flashcard from '@/components/flashcard'
import Link from 'next/link'

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadWords()
  }, [])

  const loadWords = async () => {
    try {
      // Kullanıcı bilgisini al
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUserId(user.id)

      // Tüm kelimeleri çek
      const { data: allWords, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Kullanıcının progress'ini çek
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('word_id, is_known')
        .eq('user_id', user.id)

      if (!allWords) {
        setWords([])
        setLoading(false)
        return
      }

      // Önce görülmemiş kelimeleri, sonra bilinmeyenleri göster
      const reviewedWordIds = new Set(userProgress?.map((p) => p.word_id) || [])
      const knownWordIds = new Set(
        userProgress?.filter((p) => p.is_known).map((p) => p.word_id) || []
      )

      const notReviewedWords = allWords.filter((w) => !reviewedWordIds.has(w.id))
      const unknownWords = allWords.filter(
        (w) => reviewedWordIds.has(w.id) && !knownWordIds.has(w.id)
      )

      const wordsToLearn = [...notReviewedWords, ...unknownWords]
      setWords(wordsToLearn)
    } catch (error) {
      console.error('Kelimeler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!userId || words.length === 0) return

    const currentWord = words[currentIndex]
    const isKnown = direction === 'right'

    try {
      // Progress'i kontrol et
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('word_id', currentWord.id)
        .single()

      if (existingProgress) {
        // Güncelle
        await supabase
          .from('user_progress')
          .update({
            is_known: isKnown,
            last_reviewed: new Date().toISOString(),
            review_count: existingProgress.review_count + 1,
          })
          .eq('id', existingProgress.id)
      } else {
        // Yeni kayıt oluştur
        await supabase.from('user_progress').insert({
          user_id: userId,
          word_id: currentWord.id,
          is_known: isKnown,
          last_reviewed: new Date().toISOString(),
          review_count: 1,
        })
      }

      // Sonraki kelimeye geç
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Tüm kelimeler tamamlandı
        setWords([])
      }
    } catch (error) {
      console.error('Progress kaydedilirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kelimeler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tebrikler!</h2>
          <p className="text-gray-600 mb-6">
            Tüm kelimeleri gözden geçirdiniz. Yeni kelimeler ekleyebilir veya mevcut kelimeleri
            tekrar edebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/add-word"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Kelime Ekle
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Dashboard'a Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Flashcard
          word={words[currentIndex]}
          onSwipe={handleSwipe}
          remainingCount={words.length - currentIndex}
        />
      </div>
    </div>
  )
}

