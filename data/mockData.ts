
import type { Module, Course, UserProfile, QuizScore, Notification, ModuleContent } from "../types"
import { LatestModule } from "../types";
export const mockModules: Module[] = [
  {
    id: "1",
    title: "test_for_mandatoryStatus",
    course_name: "Test_Course9thFeb",
    type: "video",
    is_prime: true,
    image_url:"https://www.themobileindian.com/wp-content/uploads/2022/10/Airtel-5G-Plus.jpg",
    published_at: "24 Feb 2025",
    activities: [
    { id: "p1", type: "image", title: "test" },
    { id: "p2", type: "image", title: "test2" },
     { id: "p3", type: "img", title: "test1" }
  ]
  },

  {
    id: "2",
    title: "Test_for_bug",
    course_name:"Test_Course9thFeb",
    type: "video",
    is_prime: true,
    image_url:"https://assets.linearb.io/uploads/code1.png",
    published_at: "19 Feb 2025",
    activities: [
    { id: "p1", type: "image", title: "test" },
     { id: "p2", type: "video", title: "test1" }
  ]
  },
  {
    id: "3",
    title: "test for module Progress",
    course_name:"Test_Course9thFeb",
    type: "document",
    is_prime: true,
    image_url:"https://www.rekalldynamics.com/cdn/shop/products/test-in-progress-sign.png?v=1678145652",
    published_at: "18 Feb 2025",
    activities: [
    { id: "p1", type: "image", title: "tet_Image" }
  ]
  },

  {
    id: "4",
    title: "test2",
    course_name:"Test_Course9thFeb",
    type: "video",
    is_prime: true,
    image_url:"https://miro.medium.com/v2/resize:fit:1400/1*044QF29GOAXgS2Q8gvCl3Q.png",
    published_at: "17 Feb 2025",
    activities: [
    { id: "p1", type: "image", title: "test" },
  ]
  },
  {
    id: "5",
    title: "test_10Feb",
    course_name:"Test_Course9thFeb",
    type: "quiz",
    is_prime:true,
    image_url:"https://media.geeksforgeeks.org/wp-content/uploads/20200415002825/comment4.png",
    published_at: "10 Feb 2025",
    quiz_attempts_allowed: 3,
    activities: [
    { id: "p1", type: "image", title: "test" }
  ]
  },
  {
    id: "6",
    title: "test_notification2",
    course_name:"test_course",
    type: "video",
    is_prime: true,
    image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmeUKxT1HYXLGr8t9R-2_hEFCc5-Goe2_BGQ&s",
    published_at: "31 Jan 2025",
    expires_at: "2024-01-20T10:00:00Z",
    activities: [
    { id: "p1", type: "video", title: "test" },
     { id: "p2", type: "image", title: "test" },
  ]
  },
  {
    id: "7",
    title: "State Management",
    type: "video",
    course_name:"abfd",
    is_prime: false,
    published_at: "2024-01-09T10:00:00Z",
  },
  {
    id: "8",
    title: "Performance Optimization",
    type: "document",
    course_name:"adjd",
    is_prime: false,
    published_at: "2024-01-08T10:00:00Z",
  },
  {
    id: "9",
    title: "Testing Strategies",
    type: "video",
    course_name:"fghf",
    is_prime: false,
    published_at: "2024-01-07T10:00:00Z",
  },
  {
    id: "10",
    title: "Publishing Your App",
    type: "video",
    course_name:"shjh",
    is_prime: false,
    published_at: "2024-01-06T10:00:00Z",
  },
  {
    id: "11",
    title: "Dark Mode Implementation",
    type: "video",
    course_name:"wertj",
    is_prime: false,
    published_at: "2024-01-05T10:00:00Z",
  },
  {
    id: "12",
    title: "Animation Mastery",
    type: "video",
    course_name:"fdgh",
    is_prime: false,
    published_at: "2024-01-04T10:00:00Z",
  },
  {
    id: "13",
    title: "Complete Mobile App Development",
    type: "video",
    course_name:"sfdfgh",
    is_prime: false,
    published_at: "2024-01-03T10:00:00Z",
  },
  {
    id: "14",
    title: "API Integration Masterclass",
    type: "video",
    course_name:"fghj",
    is_prime: false,
    published_at: "2024-01-02T10:00:00Z",
  },
  {
    id: "15",
    title: "Mobile Security Fundamentals",
    type: "video",
    course_name:"sgthy",
    is_prime: false,
    published_at: "2024-01-01T10:00:00Z",
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Native Fundamentals",
    description: "Complete course covering React Native basics and essential concepts for beginners",
    modules: [mockModules[0], mockModules[1], mockModules[4], mockModules[7], mockModules[13]],
    created_at: "2024-01-15T10:00:00Z",
    duration: "18h 30m",
  },
  {
    id: "2",
    title: "Advanced Mobile Development",
    description: "Advanced concepts and patterns for experienced developers building complex apps",
    modules: [mockModules[3], mockModules[5], mockModules[8], mockModules[11], mockModules[14]],
    created_at: "2024-01-14T10:00:00Z",
    duration: "20h 45m",
  },
  {
    id: "3",
    title: "Mobile App Design & UX",
    description: "UI/UX design principles and best practices for mobile applications",
    modules: [mockModules[2], mockModules[6], mockModules[10], mockModules[12]],
    created_at: "2024-01-13T10:00:00Z",
    duration: "12h 20m",
  },
  {
    id: "4",
    title: "Full Stack Mobile Development",
    description: "End-to-end mobile app development from design to deployment",
    modules: [mockModules[1], mockModules[3], mockModules[7], mockModules[9], mockModules[11], mockModules[13]],
    created_at: "2024-01-12T10:00:00Z",
    duration: "25h 15m",
  },
  {
    id: "5",
    title: "Modern React Native",
    description: "Latest React Native features including dark themes and advanced animations",
    modules: [mockModules[10], mockModules[11], mockModules[0], mockModules[14]],
    created_at: "2024-01-11T10:00:00Z",
    duration: "14h 05m",
  },
  {
    id: "6",
    title: "Mobile Security & Performance",
    description: "Security best practices and performance optimization for mobile apps",
    modules: [mockModules[8], mockModules[14], mockModules[15]],
    created_at: "2024-01-10T10:00:00Z",
    duration: "10h 00m",
  },
]
export const mockLatestModules: LatestModule[] =[
  {
    id: "1",
    title: "9 April 2025",
    type: "video",
    is_prime: false,
    created_at: "2025-07-01",
    course_name: "Only Prashant",
    published_at: "2025-07-17",
    activities: [
      {
        id: "activity-1",
        type: "image",
        title: "image",
        image_url:"https://upload.wikimedia.org/wikipedia/commons/f/fb/Bharti_Airtel_Logo.svg",
        module_id:"module1",
      },
      {
        id: "activity-2",
        type: "image",
        title: "bfuhefw",
        module_id:"module1",
        
      },
      {
        id:"activity-3",
        type:"image",
        title:"image",
        module_id:"module1",
      },
      {
        id:"activity-4",
        type:"image",
        title:"image",
        module_id:"module1",
      },
      {
        id:"acitity-4",
        type:"quiz",
        title:"Testing quiz 2",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "testing",
              type: "multiple_choice",
              options: ["A", "B","c","d"],
              correct_answer: [0,3],
              explanation: ["A","d"]
            },
          ],
        },
      },
    ],
  },
  {
    id: "2",
    title: "Module 2",
    type: "video",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "Only Prashant",
    published_at: "2025-07-10",
    activities: [
      {
        id: "activity-1",
        type: "video",
        title: "video2",
        module_id:"module2",
      },
      {
        id: "activity-2",
        type: "image",
        title: "img2",
        module_id:"module2",
      },
      {
        id: "activity-3",
        type: "video",
        title: "video",
        module_id:"module2",
      },
    ],
  },
  {
    id: "3",
    title: "Module 2",
    type: "video",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "Only Prashant",
    published_at: "2025-07-10",
    activities: [
      {
        id: "activity-1",
        type: "video",
        title: "video2",
        module_id:"module3",
      },
      {
        id: "activity-2",
        type: "image",
        title: "abc",
        module_id:"module3",
      },
      {
        id: "activity-3",
        type: "video",
        title: "vidi",
        module_id:"module3",
      },
    ],
  },
  {
    id: "4",
    title: "test_video",
    type: "video",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wqdewqdewfew",
    published_at: "2025-07-10",
    activities: [
      {
        id: "activity-1",
        type: "image",
        title: "image",
        module_id:"module4",
      },
    ],
  },
  {
    id: "5",
    title: "testing quiz 2",
    type: "video",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wdscewdc",
    published_at: "2025-07-08",
    activities:[
      {
        id:"acitity-1",
        type:"quiz",
        title:"Testing quiz 2",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "testing",
              type: "multiple_choice",
              options: ["A", "B"],
              correct_answer: 0,
              explanation: "A",
            },

          ],
        },
      },
      {
        id:"acitity-2",
        type:"quiz",
        title:"quiz 1",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "testing",
              type: "multiple_choice",
              options: ["A", "B"],
              correct_answer: 0,
              explanation: "A",
            },
            {
              id: "q2",
              question: "testing",
              type: "multiple_choice",
              options: ["yes", "no","none","all"],
              correct_answer: 0,
              explanation: "yes",
            },
          ],
        },
      },
      {
        id:"acitity-3",
        type:"quiz",
        title:"Testing quiz 2",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "testing",
              type: "multiple_choice",
              options: ["A", "B"],
              correct_answer: 0,
              explanation: "A",
            },
             {
              id: "q2",
              question: "testing",
              type: "multiple_choice",
              options: ["A", "B"],
              correct_answer: 0,
              explanation: "A",
            },
          ],
        },
      },
    ],
  },
  {
    id: "6",
    title: "testing quiz 1",
    type: "video",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wdscewdc",
    published_at: "2025-07-07",
    activities:[
      {
        id:"acitity-1",
        type:"quiz",
        title:"Testing quiz 1",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "tsetiung",
              type: "multiple_choice",
              options: ["A", "B"],
              correct_answer: 0,
              explanation: "A",
            },
          ],
        },
      },
    ]
  },
  {
    id: "7",
    title: "QUIZ TESTING-ANOUSHIKA",
    type: "video",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wdscewdc",
    published_at: "2025-07-07",
    activities:[
      {
        id:"acitity-1",
        type:"quiz",
        title:"Quiz 1",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "random",
              type: "multiple_choice",
              options: ["A", "B"],
              correct_answer: 0,
              explanation: "A",
            },
          ],
        },
      },
    ]
  },
  {
    id: "8",
    title: "testing done button",
    type: "document",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wdscewdc",
    published_at: "2025-08-01",
    activities:[
      {
        id:"acitity-1",
        type:"quiz",
        title:"Quiz 1",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "ques",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
      {
        id:"acitity-2",
        type:"quiz",
        title:"Quiz 2",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "ques",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
      {
        id:"acitity-3",
        type:"quiz",
        title:"Quiz 3",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "ques",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
      {
        id:"acitity-4",
        type:"quiz",
        title:"Quiz 4",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "ques",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
    ]
  },
   {
    id: "9",
    title: "testing_quiz",
    type: "document",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wdscewdc",
    published_at: "2025-07-31",
    activities:[
      {
        id:"acitity-1",
        type:"quiz",
        title:"Quiz 1",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "ques",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
      {
        id:"actitiy-2",
        type:"image",
        title:"image 1",
      },
      {
        id:"acitity-3",
        type:"quiz",
        title:"Quiz 2",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "do you follow safety guidlines",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
      {
        id:"actitiy-4",
        type:"image",
        title:"image 2",
      },
      {
        id:"acitity-5",
        type:"quiz",
        title:"Quiz 3 ",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "do you wear helmet?",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
    ]
  },
  {
    id: "10",
    title: "quiz2",
    type: "document",
    is_prime:false,
    created_at: "2025-07-01",
    course_name: "wdscewdc",
    published_at: "2025-07-31",
    activities:[
      {
        id:"acitity-1",
        type:"quiz",
        title:"Quiz 2",
        quiz_data: {
          questions: [
            {
              id: "q1",
              question: "do yuo need to wear helmet?",
              type: "multiple_choice",
              options: ["Yes", "No"],
              correct_answer: 0,
              explanation: "Yes",
            },
          ],
        },
      },
    ]
  },
]
// Persistent profile state using localStorage for web
const PROFILE_STORAGE_KEY = "atlas_user_profile"

// Default profile data
const defaultProfile: UserProfile = {
  id: "user-1",
  username: "john_doe",
  email: "john.doe@example.com",
  full_name: "John Doe",
  birth_date: "1990-01-01",
  gender: "Male",
  mobile_number: "+1234567890",
  created_at: "2024-01-01T10:00:00Z",
  // avatar: null,
}

// Load profile from storage or use default
const loadProfile = (): UserProfile => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }
  return defaultProfile
}

// Save profile to storage
const saveProfile = (profile: UserProfile): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }
}

// Global profile state
let globalProfile: UserProfile = loadProfile()

export const mockProfile: UserProfile = globalProfile

// Function to update profile globally
export const updateProfile = (updatedProfile: UserProfile): UserProfile => {
  globalProfile = { ...updatedProfile }
  saveProfile(globalProfile)
  return globalProfile
}

// Function to get current profile
export const getCurrentProfile = (): UserProfile => {
  return globalProfile
}

export const mockQuizScores: QuizScore[] = [
  {
    id: 1,
    score: 85,
    modules: { title: "React Native Basics" },
    created_at: "2024-01-15",
    total_questions: 20,
    correct_answers: 17,
  },
  {
    id: 2,
    score: 92,
    modules: { title: "JavaScript Fundamentals" },
    created_at: "2024-01-10",
    total_questions: 25,
    correct_answers: 23,
  },
  {
    id: 3,
    score: 78,
    modules: { title: "Database Integration" },
    created_at: "2024-01-05",
    total_questions: 15,
    correct_answers: 12,
  },
  {
    id: 4,
    score: 95,
    modules: { title: "UI/UX Design Quiz" },
    created_at: "2024-01-01",
    total_questions: 30,
    correct_answers: 29,
  },
  {
    id: 5,
    score: 88,
    modules: { title: "Testing Strategies" },
    created_at: "2023-12-28",
    total_questions: 18,
    correct_answers: 16,
  },
  {
    id: 6,
    score: 91,
    modules: { title: "Dark Mode Implementation" },
    created_at: "2023-12-25",
    total_questions: 12,
    correct_answers: 11,
  },
]

// Global notifications state with localStorage persistence
const NOTIFICATIONS_STORAGE_KEY = "atlas_notifications"

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "New Dark Theme Module",
    message: "A new module 'Dark Mode Implementation' has been added to your learning path.",
    type: "module_assigned",
    is_read: false,
    created_at: "2024-01-16T10:00:00Z",
  },
  {
    id: "2",
    title: "Quiz Available",
    message: "You can now take the quiz for 'JavaScript Fundamentals' module.",
    type: "quiz_available",
    is_read: false,
    created_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "3",
    title: "Module Expiring Soon",
    message: "Your access to 'Advanced Navigation' will expire in 3 days.",
    type: "module_expired",
    is_read: true,
    created_at: "2024-01-14T09:15:00Z",
  },
  {
    id: "4",
    title: "New Animation Course",
    message: "Check out the new 'Animation Mastery' course now available!",
    type: "course_uploaded",
    is_read: false,
    created_at: "2024-01-13T16:45:00Z",
  },
]

// Load notifications from storage or use default
const loadNotifications = (): Notification[] => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }
  return defaultNotifications
}

// Save notifications to storage
const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }
}

// Global notifications state
let globalNotifications: Notification[] = loadNotifications()

// Function to get current notifications
export const getNotifications = (): Notification[] => {
  return globalNotifications
}

// Function to update notifications globally
export const updateNotifications = (updatedNotifications: Notification[]): Notification[] => {
  globalNotifications = [...updatedNotifications]
  saveNotifications(globalNotifications)
  return globalNotifications
}

// Function to mark all notifications as read
export const markAllNotificationsAsRead = (): Notification[] => {
  const updatedNotifications = globalNotifications.map((notification) => ({
    ...notification,
    is_read: true,
  }))
  return updateNotifications(updatedNotifications)
}

// Function to mark a single notification as read
export const markNotificationAsRead = (notificationId: string): Notification[] => {
  const updatedNotifications = globalNotifications.map((notification) =>
    notification.id === notificationId ? { ...notification, is_read: true } : notification,
  )
  return updateNotifications(updatedNotifications)
}

// Function to get unread notification count
export const getUnreadNotificationCount = (): number => {
  return globalNotifications.filter((n) => !n.is_read).length
}

// Export for backward compatibility
export const mockNotifications = globalNotifications

// Learning statistics
export const mockLearningStats = {
  totalHoursLearned: 52.5,
  currentStreak: 7,
  longestStreak: 15,
  averageScore: 88,
  certificatesEarned: 3,
  badgesEarned: 15,
}

export const mockModuleContent: { [module_id: string]: ModuleContent[] } = {
  "1": [
    {
      id: "content-1-1",
      module_id: "1",
      type: "video",
      title: "Introduction Video",
      url: "https://example.com/video1.mp4",
      order: 1,
    },
    {
      id: "content-1-2",
      module_id: "1",
      type: "pdf",
      title: "Course Materials",
      url: "https://example.com/materials.pdf",
      order: 2,
    },
    {
      id: "content-1-3",
      module_id: "1",
      type: "quiz",
      title: "Knowledge Check",
      quiz_data: {
        questions: [
          {
            id: "q1",
            question: "What is React Native?",
            type: "multiple_choice",
            options: ["A web framework", "A mobile app development framework", "A database", "A programming language"],
            correct_answer: 1,
            explanation: "React Native is a framework for building mobile applications using React.",
          },
          {
            id: "q2",
            question: "React Native uses JavaScript for development.",
            type: "true_false",
            options: ["True", "False"],
            correct_answer: 0,
            explanation: "Yes, React Native uses JavaScript and React concepts.",
          },
        ],
        passing_score: 70,
        time_limit: 300,
      },
      order: 3,
    },
  ],
  "2": [
    {
      id: "content-2-1",
      module_id: "2",
      type: "video",
      title: "JavaScript ES6+ Features",
      url: "https://example.com/video2.mp4",
      order: 1,
    },
    {
      id: "content-2-2",
      module_id: "2",
      type: "image",
      title: "Syntax Examples",
      url: "https://example.com/syntax.png",
      order: 2,
    },
    {
      id: "content-2-3",
      module_id: "2",
      type: "audio",
      title: "Pronunciation Guide",
      url: "https://example.com/audio.mp3",
      order: 3,
    },
  ],
  "13": [
    {
      id: "content-13-1",
      module_id: "13",
      type: "video",
      title: "Complete App Development Overview",
      url: "https://example.com/complete-video.mp4",
      order: 1,
    },
    {
      id: "content-13-2",
      module_id: "13",
      type: "pdf",
      title: "Development Guide",
      url: "https://example.com/dev-guide.pdf",
      order: 2,
    },
    {
      id: "content-13-3",
      module_id: "13",
      type: "image",
      title: "App Architecture Diagram",
      url: "https://example.com/architecture.png",
      order: 3,
    },
    {
      id: "content-13-4",
      module_id: "13",
      type: "audio",
      title: "Expert Interview",
      url: "https://example.com/interview.mp3",
      order: 4,
    },
    {
      id: "content-13-5",
      module_id: "13",
      type: "quiz",
      title: "Final Assessment",
      quiz_data: {
        questions: [
          {
            id: "q1",
            question: "What are the key components of a mobile app architecture?",
            type: "multiple_choice",
            options: ["UI Layer only", "UI, Business Logic, and Data Layer", "Database only", "API only"],
            correct_answer: 1,
            explanation: "A complete mobile app has UI Layer, Business Logic Layer, and Data Layer.",
          },
          {
            id: "q2",
            question: "Performance optimization is important for mobile apps.",
            type: "true_false",
            options: ["True", "False"],
            correct_answer: 0,
            explanation: "Yes, mobile devices have limited resources, so optimization is crucial.",
          },
          {
            id: "q3",
            question: "Which testing strategy is most effective for mobile apps?",
            type: "multiple_choice",
            options: [
              "Unit testing only",
              "Integration testing only",
              "Combination of unit, integration, and E2E testing",
              "Manual testing only",
            ],
            correct_answer: 2,
            explanation: "A comprehensive testing strategy includes unit, integration, and end-to-end testing.",
          },
        ],
        passing_score: 80,
        time_limit: 600,
      },
      order: 5,
    },
  ],
  "14": [
    {
      id: "content-14-1",
      module_id: "14",
      type: "video",
      title: "API Integration Basics",
      url: "https://example.com/api-video.mp4",
      order: 1,
    },
    {
      id: "content-14-2",
      module_id: "14",
      type: "pdf",
      title: "API Documentation",
      url: "https://example.com/api-docs.pdf",
      order: 2,
    },
    {
      id: "content-14-3",
      module_id: "14",
      type: "image",
      title: "API Flow Diagram",
      url: "https://example.com/api-flow.png",
      order: 3,
    },
    {
      id: "content-14-4",
      module_id: "14",
      type: "audio",
      title: "Best Practices Discussion",
      url: "https://example.com/best-practices.mp3",
      order: 4,
    },
    {
      id: "content-14-5",
      module_id: "14",
      type: "quiz",
      title: "API Integration Quiz",
      quiz_data: {
        questions: [
          {
            id: "q1",
            question: "What is REST API?",
            type: "multiple_choice",
            options: [
              "A database",
              "An architectural style for web services",
              "A programming language",
              "A mobile framework",
            ],
            correct_answer: 1,
            explanation: "REST (Representational State Transfer) is an architectural style for designing web services.",
          },
          {
            id: "q2",
            question: "GraphQL is a query language for APIs.",
            type: "true_false",
            options: ["True", "False"],
            correct_answer: 0,
            explanation: "Yes, GraphQL is a query language and runtime for APIs.",
          },
        ],
        passing_score: 75,
        time_limit: 300,
      },
      order: 5,
    },
  ],
  "15": [
    {
      id: "content-15-1",
      module_id: "15",
      type: "video",
      title: "Mobile Security Overview",
      url: "https://example.com/security-video.mp4",
      order: 1,
    },
    {
      id: "content-15-2",
      module_id: "15",
      type: "pdf",
      title: "Security Checklist",
      url: "https://example.com/security-checklist.pdf",
      order: 2,
    },
    {
      id: "content-15-3",
      module_id: "15",
      type: "image",
      title: "Security Architecture",
      url: "https://example.com/security-arch.png",
      order: 3,
    },
    {
      id: "content-15-4",
      module_id: "15",
      type: "audio",
      title: "Security Expert Interview",
      url: "https://example.com/security-interview.mp3",
      order: 4,
    },
    {
      id: "content-15-5",
      module_id: "15",
      type: "quiz",
      title: "Security Assessment",
      quiz_data: {
        questions: [
          {
            id: "q1",
            question: "What is the most important aspect of mobile app security?",
            type: "multiple_choice",
            options: ["UI Design", "Data encryption", "App performance", "User experience"],
            correct_answer: 1,
            explanation: "Data encryption is crucial for protecting sensitive user information.",
          },
          {
            id: "q2",
            question: "HTTPS should always be used for API communications.",
            type: "true_false",
            options: ["True", "False"],
            correct_answer: 0,
            explanation: "Yes, HTTPS encrypts data in transit and is essential for secure communications.",
          },
        ],
        passing_score: 80,
        time_limit: 300,
      },
      order: 5,
    },
  ],
}

// Track content completion status
export const mockContentProgress: { [module_id: string]: { [contentId: string]: boolean } } = {
  "1": {
    "content-1-1": false,
    "content-1-2": false,
    "content-1-3": false,
  },
  "2": {
    "content-2-1": false,
    "content-2-2": false,
    "content-2-3": false,
  },
  "13": {
    "content-13-1": false,
    "content-13-2": false,
    "content-13-3": false,
    "content-13-4": false,
    "content-13-5": false,
  },
  "14": {
    "content-14-1": false,
    "content-14-2": false,
    "content-14-3": false,
    "content-14-4": false,
    "content-14-5": false,
  },
  "15": {
    "content-15-1": false,
    "content-15-2": false,
    "content-15-3": false,
    "content-15-4": false,
    "content-15-5": false,
  },
}
