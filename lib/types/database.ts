export type Word = {
  id: string
  english: string
  turkish: string
  is_default: boolean
  created_by: string | null
  created_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  word_id: string
  is_known: boolean
  last_reviewed: string
  review_count: number
}

export type Profile = {
  user_id: string
  username: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      words: {
        Row: Word
        Insert: Omit<Word, 'id' | 'created_at'>
        Update: Partial<Omit<Word, 'id' | 'created_at'>>
      }
      user_progress: {
        Row: UserProgress
        Insert: Omit<UserProgress, 'id'>
        Update: Partial<Omit<UserProgress, 'id'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
    }
  }
}

