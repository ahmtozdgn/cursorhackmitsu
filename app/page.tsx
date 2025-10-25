import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Eğer kullanıcı giriş yapmışsa dashboard'a yönlendir
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-8 animate-bounce">📚</div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            FlashLearn
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Yapay zeka destekli flashcard sistemiyle yabancı dil kelimelerini eğlenceli bir şekilde öğrenin
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Hemen Başla
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
            >
              Giriş Yap
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Swipe ile Öğren</h3>
              <p className="text-white/80">
                Kelimeleri sağa-sola kaydırarak öğrenin
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">İlerlemenizi Takip Edin</h3>
              <p className="text-white/80">
                Detaylı istatistiklerle gelişiminizi görün
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">➕</div>
              <h3 className="text-xl font-bold mb-2">Özel Kelimeler</h3>
              <p className="text-white/80">
                Kendi kelimelerinizi ekleyin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
