"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Course, Module } from "../types"

interface CourseDetailScreenProps {
  course: Course
  onBack: () => void
  onNavigateToModule: (module: Module) => void
}

export default function CourseDetailScreen({ course, onBack, onNavigateToModule }: CourseDetailScreenProps) {
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    // Load course modules
    setModules(course.modules || [])
  }, [course])

  const getModuleImage = (module: Module) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]
    const colorIndex = Number.parseInt(module.id) % colors.length
    return colors[colorIndex]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50"
      case "in_progress":
        return "#FF9800"
      case "expired":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case "video":
        return "play-circle-outline"
      case "image":
        return "image-outline"
      case "document":
        return "document-text-outline"
      case "quiz":
        return "help-circle-outline"
      default:
        return "book-outline"
    }
  }

  const getCompletedModules = () => {
    return modules.filter((m) => m.status === "completed").length
  }

  const getProgressPercentage = () => {
    if (modules.length === 0) return 0
    return Math.round((getCompletedModules() / modules.length) * 100)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Course Info */}
        <View style={styles.courseInfoContainer}>
          <View style={[styles.courseImage, { backgroundColor: getModuleImage({ id: course.id } as Module) }]}>
            <Ionicons name="school" size={40} color="rgba(255,255,255,0.9)" />
          </View>

          <View style={styles.courseDetails}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>

            <View style={styles.courseMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#b0b0b0" />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="library-outline" size={16} color="#b0b0b0" />
                <Text style={styles.metaText}>{modules.length} modules</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Course Progress</Text>
                <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {getCompletedModules()} of {modules.length} modules completed
              </Text>
            </View>
          </View>
        </View>

        {/* Course Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Course Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{getCompletedModules()}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="play-circle" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>{modules.filter((m) => m.status === "in_progress").length}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#9E9E9E" />
              <Text style={styles.statNumber}>{modules.filter((m) => m.status === "not_started").length}</Text>
              <Text style={styles.statLabel}>Not Started</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={24} color="#F44336" />
              <Text style={styles.statNumber}>{modules.filter((m) => m.status === "expired").length}</Text>
              <Text style={styles.statLabel}>Expired</Text>
            </View>
          </View>
        </View>

        {/* Modules List */}
        <View style={styles.modulesContainer}>
          <Text style={styles.sectionTitle}>Course Modules ({modules.length})</Text>

          {modules.length > 0 ? (
            modules.map((module, index) => (
              <TouchableOpacity key={module.id} style={styles.moduleCard} onPress={() => onNavigateToModule(module)}>
                <View style={styles.moduleNumber}>
                  <Text style={styles.moduleNumberText}>{index + 1}</Text>
                </View>

                <View style={[styles.moduleImage, { backgroundColor: getModuleImage(module) }]}>
                  <Ionicons name={getModuleIcon(module.type)} size={24} color="rgba(255,255,255,0.9)" />
                  {module.is_prime && (
                    <View style={styles.primeLabel}>
                      <Ionicons name="star" size={10} color="#FFD700" />
                    </View>
                  )}
                </View>

                <View style={styles.moduleContent}>
                  <View style={styles.moduleHeader}>
                    <Text style={styles.moduleTitle} numberOfLines={2}>
                      {module.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(module.status) }]}>
                      <Text style={styles.statusText}>{module.status.replace("_", " ").toUpperCase()}</Text>
                    </View>
                  </View>

                  <Text style={styles.moduleDescription} numberOfLines={2}>
                    {module.description}
                  </Text>

                  <View style={styles.moduleMeta}>
                    <View style={styles.moduleMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#b0b0b0" />
                      <Text style={styles.moduleMetaText}>{module.duration}</Text>
                    </View>

                    <View style={styles.moduleMetaItem}>
                      <Ionicons name="layers-outline" size={14} color="#b0b0b0" />
                      <Text style={styles.moduleMetaText}>{module.type}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.moduleArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#b0b0b0" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="library-outline" size={60} color="#666" />
              <Text style={styles.emptyStateText}>No modules available</Text>
              <Text style={styles.emptyStateSubtext}>This course doesn't have any modules yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    minHeight: Platform.OS === "web" ? 100 : undefined,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 20 : 50,
    paddingBottom: 20,
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  courseInfoContainer: {
    backgroundColor: "#2a2a2a",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  courseDetails: {
    alignItems: "center",
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 16,
    color: "#b0b0b0",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#b0b0b0",
    marginLeft: 5,
  },
  progressSection: {
    width: "100%",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#404040",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#b0b0b0",
    textAlign: "center",
  },
  statsContainer: {
    backgroundColor: "#2a2a2a",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#3a3a3a",
    borderRadius: 10,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#b0b0b0",
    marginTop: 2,
  },
  modulesContainer: {
    backgroundColor: "#2a2a2a",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  moduleNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  moduleNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  moduleImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },
  primeLabel: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 2,
  },
  moduleContent: {
    flex: 1,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  moduleDescription: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 10,
    lineHeight: 18,
  },
  moduleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  moduleMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  moduleMetaText: {
    fontSize: 12,
    color: "#b0b0b0",
    marginLeft: 4,
  },
  moduleArrow: {
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
})
