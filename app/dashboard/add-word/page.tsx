'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddWordPage() {
  const [english, setEnglish] = useState('')
  const [turkish, setTurkish] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Lütfen giriş yapın')
        return
      }

      // Kelimeyi ekle
      const { error: insertError } = await supabase.from('words').insert({
        english: english.trim().toLowerCase(),
        turkish: turkish.trim().toLowerCase(),
        is_default: false,
        created_by: user.id,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setEnglish('')
      setTurkish('')

      // 2 saniye sonra kelimeler sayfasına yönlendir
      setTimeout(() => {
        router.push('/dashboard/words')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Kelime eklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Kelime Ekle</h1>
        <p className="text-gray-600">
          Öğrenmek istediğiniz kelimeleri ekleyin
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="english"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              İngilizce Kelime
            </label>
            <input
              id="english"
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="örn: apple"
            />
          </div>

          <div>
            <label
              htmlFor="turkish"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Türkçe Karşılığı
            </label>
            <input
              id="turkish"
              type="text"
              value={turkish}
              onChange={(e) => setTurkish(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="örn: elma"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
              ✓ Kelime başarıyla eklendi! Yönlendiriliyorsunuz...
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ekleniyor...' : 'Kelime Ekle'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/words')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              İptal
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">İpuçları</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Kelimeleri küçük harflerle yazın</li>
            <li>• Kelime grupları için boşluk kullanabilirsiniz</li>
            <li>• Eklediğiniz kelimeler hemen öğrenme havuzuna eklenecektir</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

