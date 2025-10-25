# FlashLearn Kurulum Rehberi

## 1. Node.js ve npm Kurulumu

Öncelikle sisteminizde Node.js'in kurulu olduğundan emin olun:
```bash
node --version
npm --version
```

## 2. Bağımlılıkları Yükleme

```bash
npm install
```

## 3. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Project Settings > API bölümünden şu bilgileri alın:
   - `Project URL`
   - `anon` `public` API Key

## 4. Environment Variables Ayarlama

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Database Tablolarını Oluşturma

Supabase SQL Editor'de aşağıdaki SQL komutlarını çalıştırın:

### Words Tablosu
```sql
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  english TEXT NOT NULL,
  turkish TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index oluştur
CREATE INDEX idx_words_is_default ON words(is_default);
CREATE INDEX idx_words_created_by ON words(created_by);
```

### User Progress Tablosu
```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  word_id UUID REFERENCES words(id) NOT NULL,
  is_known BOOLEAN DEFAULT false,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  UNIQUE(user_id, word_id)
);

-- Index oluştur
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_word_id ON user_progress(word_id);
```

### Profiles Tablosu (Opsiyonel)
```sql
CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 6. Row Level Security (RLS) Politikaları

### Words Tablosu İçin
```sql
-- RLS'i aktif et
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Herkes default kelimeleri okuyabilir
CREATE POLICY "Anyone can read default words"
ON words FOR SELECT
USING (is_default = true);

-- Kullanıcılar kendi kelimelerini okuyabilir
CREATE POLICY "Users can read own words"
ON words FOR SELECT
USING (created_by = auth.uid());

-- Kullanıcılar kelime ekleyebilir
CREATE POLICY "Users can insert words"
ON words FOR INSERT
WITH CHECK (created_by = auth.uid());
```

### User Progress Tablosu İçin
```sql
-- RLS'i aktif et
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi progress'lerini görebilir
CREATE POLICY "Users can view own progress"
ON user_progress FOR SELECT
USING (user_id = auth.uid());

-- Kullanıcılar kendi progress'lerini ekleyebilir
CREATE POLICY "Users can insert own progress"
ON user_progress FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Kullanıcılar kendi progress'lerini güncelleyebilir
CREATE POLICY "Users can update own progress"
ON user_progress FOR UPDATE
USING (user_id = auth.uid());
```

## 7. Default Kelimeleri Yükleme

Sunucu çalıştıktan sonra, default kelimeleri yüklemek için:

```bash
curl -X POST http://localhost:3000/api/init-words
```

Veya tarayıcınızda `/api/init-words` adresine POST isteği gönderin.

## 8. Uygulamayı Çalıştırma

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 9. Email Doğrulama Ayarları (Opsiyonel)

Development ortamında email doğrulamasını devre dışı bırakmak için:

1. Supabase Dashboard > Authentication > Settings
2. "Enable email confirmations" seçeneğini devre dışı bırakın

## Troubleshooting

### npm bulunamadı hatası
- Node.js'in PATH'e eklendiğinden emin olun
- Terminal'i yeniden başlatın

### Supabase bağlantı hatası
- `.env.local` dosyasının doğru konumda olduğunu kontrol edin
- Environment variables'ların doğru olduğunu kontrol edin
- Projeyi yeniden başlatın

### RLS politika hatası
- Supabase Dashboard'da RLS politikalarının aktif olduğunu kontrol edin
- Kullanıcının giriş yaptığından emin olun

## Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Swipe ile kelime öğrenme
- ✅ İlerleme takibi
- ✅ Custom kelime ekleme
- ✅ Dashboard ve istatistikler
- ✅ 100 default İngilizce-Türkçe kelime

