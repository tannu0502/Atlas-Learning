"use client"
import ActivityDetailScreen from "./components/ActivityDetailScreen" // Adjust path if needed
import { useState } from "react"
import { View, StyleSheet, Platform, Dimensions } from "react-native"
import { StatusBar } from "expo-status-bar"
import type { Module, Course } from "./types"
import HomeScreen from "./components/HomeScreen"
import PerformanceScreen from "./components/PerformanceScreen"
import ProfileScreen from "./components/ProfileScreen"
import ViewAllScreen from "./components/ViewAllScreen"
import NotificationScreen from "./components/NotificationScreen"
import ModuleDetailScreen from "./components/ModuleDetailScreen"
import CourseDetailScreen from "./components/CourseDetailScreen"
import type { ModuleContent } from "./types"

type Screen = "home" | "performance" | "profile" | "viewAll" | "notifications" | "moduleDetail" | "courseDetail" | "activityDetail"
type ViewAllType = "prime" | "latest" | "progress" | "courses" |"Only Prashant"

interface NavigationState {
  screen: Screen
  data?: any
}
interface ActivityDetailScreenProps {
  activity: ModuleContent
  onBack: () => void
}
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([{ screen: "home" }])
  const [viewAllType, setViewAllType] = useState<ViewAllType>("prime")
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [moduleProgress, setModuleProgress] = useState<{ [moduleId: string]: { [contentId: string]: boolean } }>({});
  const [selectedActivity, setSelectedActivity] = useState<ModuleContent | null>(null)
  const navigateToActivity = (activity: ModuleContent) => {
  setSelectedActivity(activity)
  navigateToScreen("activityDetail", { activity })
}

  const handleLogout = () => {
    // Reset to home and clear navigation stack
    setCurrentScreen("home")
    setNavigationStack([{ screen: "home" }])
  }

  const navigateToScreen = (screen: Screen, data?: any) => {
    const newState: NavigationState = { screen, data }
    setNavigationStack((prev) => [...prev, newState])
    setCurrentScreen(screen)
  }

  const navigateBack = () => {
    setNavigationStack((prev) => {
      if (prev.length > 1) {
        const newStack = [...prev]
        newStack.pop() // Remove current screen
        const previousState = newStack[newStack.length - 1]

        // Restore the previous screen and its data
        setCurrentScreen(previousState.screen)

        // Restore any screen-specific data
        if (previousState.data) {
          if (previousState.screen === "moduleDetail") {
            setSelectedModule(previousState.data.module)
          } else if (previousState.screen === "courseDetail") {
            setSelectedCourse(previousState.data.course)
          } else if (previousState.screen === "viewAll") {
            setViewAllType(previousState.data.viewAllType)
          }
        }

        return newStack
      } else {
        // If no history, go to home
        setCurrentScreen("home")
        return [{ screen: "home" }]
      }
    })
  }

  const navigateToModule = (module: Module) => {
    setSelectedModule(module)
    navigateToScreen("moduleDetail", { module })
  }

  const navigateToNotifications = () => {
    navigateToScreen("notifications")
  }

  const handleViewAllModules = (type: string) => {
    setViewAllType(type as ViewAllType)
    navigateToScreen("viewAll", { viewAllType: type })
  }

  const handleViewAllCourses = () => {
    setViewAllType("courses")
    navigateToScreen("viewAll", { viewAllType: "courses" })
  }

  const navigateToCourse = (course: Course) => {
    setSelectedCourse(course)
    navigateToScreen("courseDetail", { course })
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "performance":
        return <PerformanceScreen onBack={navigateBack} onNavigateToModule={navigateToModule} />
      case "profile":
        return <ProfileScreen onBack={navigateBack} onLogout={handleLogout} />
      case "viewAll":
        return (
          <ViewAllScreen
            onBack={navigateBack}
            onNavigateToModule={navigateToModule}
            onNavigateToCourse={navigateToCourse}
            type={viewAllType}
          />
        )
      case "notifications":
        return <NotificationScreen onBack={navigateBack} onNavigateToModule={navigateToModule} />
      case "moduleDetail":
        return selectedModule ? (
          <ModuleDetailScreen
            module={selectedModule}
            onBack={navigateBack}
            onNavigateToActivity={navigateToActivity}
          />
        ) : null
      case "courseDetail":
        return selectedCourse ? (
          <CourseDetailScreen course={selectedCourse} onBack={navigateBack} onNavigateToModule={navigateToModule} />
        ) : null
        case "activityDetail":
          return selectedActivity ? (
            <ActivityDetailScreen activity={selectedActivity} onBack={navigateBack} />
          ) : null
       
      default:
        return (
          <HomeScreen
            onNavigateToProfile={() => navigateToScreen("profile")}
            onNavigateToPerformance={() => navigateToScreen("performance")}
            onNavigateToModule={navigateToModule}
            onViewAllModules={handleViewAllModules}
            onViewAllCourses={handleViewAllCourses}
            onNavigateToNotifications={navigateToNotifications}
            onNavigateToCourse={navigateToCourse}
          />
        )
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderCurrentScreen()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Platform.OS === "web" ? 600 : undefined,
    backgroundColor: "#121212",
  },
})
