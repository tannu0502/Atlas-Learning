export interface Module {
  id: string
  title: string
  description?: string
  type: "video" | "image" | "document" | "quiz"
  status?: "not_started" | "in_progress" | "completed" | "expired"
  is_prime: boolean
  created_at?: string
  courseTitle?: string;
  published_at?: string;
  course_name: string;
  expires_at?: string
  quiz_attempts_allowed?: number
  quiz_attempts_used?: number
  score?: number
  duration?: string
  image_url?: string;
  activities?: any[]; 
  modules?: Module[]
  moduleId?: string;
}

export interface Course {
  id: string
  title: string
  description: string
  modules: Module[]
  created_at: string
  duration?: string
  instructor?: string
}
export interface LatestModule extends Module {
  course_name: string;
  published_at: string;
}

export interface UserProfile {
  id: string
  username: string
  email: string
  full_name: string
  birth_date: string
  gender: string
  mobile_number: string
  created_at: string
  avatar?: string
}

export interface QuizScore {
  id: number
  score: number
  modules: { title: string }
  created_at: string
  total_questions?: number
  correct_answers?: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "module_assigned" | "course_uploaded" | "quiz_available" | "module_expired"
  is_read: boolean
  created_at: string
}

export interface ModuleContent {
  id: string
  module_id: string
  type: "video" | "pdf" | "image" | "audio" | "quiz"
  title: string
  url?: string
  content?: string
  quiz_data?: QuizData
  order: number
  status?: "not_started" | "in_progress" | "completed" | "expired"
}

export interface QuizData {
  questions: QuizQuestion[]
  passing_score: number
  time_limit?: number
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "true_false" | "text"
  options?: string[]
  correct_answer: string | number
  explanation?: string
}

export interface QuizAttempt {
  id: string
  module_id: string
  user_answers: { [questionId: string]: string | number }
  score: number
  completed_at: string
  time_taken: number
}
