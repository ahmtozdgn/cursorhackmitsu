import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function WordsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Tüm kelimeleri çek
  const { data: words } = await supabase
    .from('words')
    .select('*')
    .order('created_at', { ascending: false })

  // Kullanıcının progress'ini çek
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('word_id, is_known, review_count')
    .eq('user_id', user!.id)

  const progressMap = new Map(userProgress?.map((p) => [p.word_id, p]) || [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tüm Kelimeler</h1>
          <p className="text-gray-600">
            Toplam {words?.length || 0} kelime bulunuyor
          </p>
        </div>
        <Link
          href="/dashboard/add-word"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Kelime Ekle
        </Link>
      </div>

      {words && words.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word) => {
            const progress = progressMap.get(word.id)
            const isKnown = progress?.is_known
            const reviewCount = progress?.review_count || 0

            return (
              <div
                key={word.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {word.english}
                    </h3>
                    <p className="text-gray-600">{word.turkish}</p>
                  </div>
                  {isKnown !== undefined && (
                    <span className="text-2xl ml-2">
                      {isKnown ? '✅' : '❌'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      word.is_default
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {word.is_default ? 'Varsayılan' : 'Özel'}
                  </span>
                  {reviewCount > 0 && (
                    <span className="text-gray-500">{reviewCount}x görüldü</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Henüz kelime yok
          </h2>
          <p className="text-gray-600 mb-6">
            Öğrenmeye başlamak için kelime ekleyin
          </p>
          <Link
            href="/dashboard/add-word"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Kelime Ekle
          </Link>
        </div>
      )}
    </div>
  )
}

