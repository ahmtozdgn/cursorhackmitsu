import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Tüm kelimeleri çek
  const { data: allWords } = await supabase.from('words').select('*')

  // Kullanıcının progress'ini çek
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user!.id)

  // İstatistikleri hesapla
  const totalWords = allWords?.length || 0
  const knownWords = userProgress?.filter((p) => p.is_known).length || 0
  const unknownWords = userProgress?.filter((p) => !p.is_known).length || 0
  const notReviewedYet = totalWords - (userProgress?.length || 0)

  // Son öğrenilen kelimeler
  const recentProgress = userProgress
    ?.sort((a, b) => new Date(b.last_reviewed).getTime() - new Date(a.last_reviewed).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Öğrenme ilerlemenizi takip edin</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Toplam Kelime</div>
          <div className="text-3xl font-bold text-gray-900">{totalWords}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Bilinen</div>
          <div className="text-3xl font-bold text-green-600">{knownWords}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Bilinmeyen</div>
          <div className="text-3xl font-bold text-red-600">{unknownWords}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Henüz Görülmedi</div>
          <div className="text-3xl font-bold text-blue-600">{notReviewedYet}</div>
        </div>
      </div>

      {/* İlerleme Barı */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Öğrenme İlerlemeniz</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${totalWords > 0 ? (knownWords / totalWords) * 100 : 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0}% tamamlandı
        </p>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/learn"
          className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-8 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Öğrenmeye Başla</h3>
          <p className="text-indigo-100">Flashcard'larla kelime öğrenmeye devam edin</p>
        </Link>

        <Link
          href="/dashboard/add-word"
          className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl p-8 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">➕</div>
          <h3 className="text-2xl font-bold mb-2">Kelime Ekle</h3>
          <p className="text-pink-100">Öğrenmek istediğiniz yeni kelimeler ekleyin</p>
        </Link>
      </div>

      {/* Son Aktiviteler */}
      {recentProgress && recentProgress.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-3">
            {recentProgress.map((progress) => {
              const word = allWords?.find((w) => w.id === progress.word_id)
              return (
                <div
                  key={progress.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{progress.is_known ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-medium text-gray-900">{word?.english}</p>
                      <p className="text-sm text-gray-600">{word?.turkish}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {progress.review_count} kez görüldü
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

