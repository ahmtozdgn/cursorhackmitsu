import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import defaultWords from '@/data/default-words.json'

export async function POST() {
  try {
    const supabase = await createClient()

    // Admin kontrolü veya ilk kurulum kontrolü yapılabilir
    // Şimdilik basit tutuyoruz

    // Mevcut default kelimeleri kontrol et
    const { data: existingWords } = await supabase
      .from('words')
      .select('english')
      .eq('is_default', true)

    const existingSet = new Set(existingWords?.map((w) => w.english) || [])

    // Yeni kelimeleri filtrele
    const newWords = defaultWords.filter((word) => !existingSet.has(word.english))

    if (newWords.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tüm default kelimeler zaten mevcut',
        inserted: 0,
      })
    }

    // Yeni kelimeleri ekle
    const { error } = await supabase.from('words').insert(
      newWords.map((word) => ({
        english: word.english,
        turkish: word.turkish,
        is_default: true,
        created_by: null,
      }))
    )

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `${newWords.length} kelime eklendi`,
      inserted: newWords.length,
    })
  } catch (error: any) {
    console.error('Default kelimeler yüklenirken hata:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Kelimeler yüklenemedi',
      },
      { status: 500 }
    )
  }
}

