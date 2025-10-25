# 📚 FlashLearn - Kelime Öğrenme Uygulaması

Swipe tabanlı flashcard sistemiyle İngilizce-Türkçe kelime öğrenme uygulaması.

## 🚀 Özellikler

- **Swipe Öğrenme:** Kelimeleri sağa-sola kaydırarak bildiğinizi veya bilmediğinizi belirtin
- **Flip Kartlar:** Kartı çevirerek kelimenin karşılığını görün
- **İlerleme Takibi:** Öğrenme istatistiklerinizi detaylı olarak takip edin
- **Custom Kelimeler:** Kendi kelimelerinizi ekleyin
- **100 Default Kelime:** Başlangıç için hazır kelime seti
- **Supabase Auth:** Güvenli kullanıcı girişi
- **Responsive Tasarım:** Mobil ve masaüstünde mükemmel çalışır

## 🛠️ Teknolojiler

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth

## 📦 Kurulum

Detaylı kurulum talimatları için [SETUP.md](./SETUP.md) dosyasına bakın.

### Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# .env.local dosyası oluştur ve Supabase bilgilerini ekle
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Geliştirme sunucusunu başlat
npm run dev
```

## 📁 Proje Yapısı

```
├── app/
│   ├── (auth)/
│   │   ├── login/          # Giriş sayfası
│   │   └── signup/         # Kayıt sayfası
│   ├── dashboard/          # Korumalı sayfalar
│   │   ├── learn/          # Flashcard öğrenme sayfası
│   │   ├── words/          # Kelime listesi
│   │   ├── add-word/       # Yeni kelime ekleme
│   │   └── page.tsx        # Dashboard ana sayfa
│   ├── api/
│   │   └── init-words/     # Default kelimeleri yükleme API
│   └── page.tsx            # Landing page
├── components/
│   ├── flashcard.tsx       # Swipe özellikli kart
│   └── navigation.tsx      # Navigasyon barı
├── lib/
│   ├── supabase/           # Supabase client/server
│   └── types/              # TypeScript type'lar
└── data/
    └── default-words.json  # 100 başlangıç kelimesi
```

## 🎯 Kullanım

1. **Kayıt Ol:** Email ve şifre ile hesap oluşturun
2. **Giriş Yap:** Hesabınıza giriş yapın
3. **Öğrenmeye Başla:** "Öğren" sayfasına gidin
4. **Swipe:** 
   - Sağa kaydır (✓) → Kelimeyi biliyorum
   - Sola kaydır (✗) → Kelimeyi bilmiyorum
5. **Kartı Çevir:** Kartı tıklayarak Türkçe karşılığını görün
6. **İlerleme:** Dashboard'da istatistiklerinizi takip edin

## 🗄️ Database Şeması

### words
- `id` - UUID
- `english` - Kelime (İngilizce)
- `turkish` - Çeviri (Türkçe)
- `is_default` - Varsayılan kelime mi?
- `created_by` - Oluşturan kullanıcı

### user_progress
- `id` - UUID
- `user_id` - Kullanıcı
- `word_id` - Kelime
- `is_known` - Biliniyor mu?
- `last_reviewed` - Son görülme
- `review_count` - Görülme sayısı

## 🔒 Güvenlik

- Row Level Security (RLS) aktif
- Kullanıcılar sadece kendi verilerini görebilir
- Default kelimeler herkese açık
- Custom kelimeler sadece oluşturana özel

## 🎨 Tasarım

- Modern gradient renkler
- Smooth animasyonlar
- 3D flip efektleri
- Touch/swipe friendly
- Responsive layout

## 📝 Hackathon İçin Notlar

Bu proje 3 saatlik bir hackathon için tasarlanmıştır:
- ✅ Temel özellikler hazır
- ✅ Database schema oluşturuldu
- ✅ Authentication sistemi
- ✅ Flashcard component
- ✅ İlerleme takibi
- 🎨 Tasarım özelleştirmeye açık

## 🚧 Geliştirme Fikirleri

- AI ile örnek cümleler
- Sesli telaffuz
- Spaced repetition algoritması
- Daha fazla dil desteği
- Sosyal özellikler (kelime seti paylaşımı)
- Başarı rozetleri
- Günlük hedefler

## 📄 Lisans

MIT
