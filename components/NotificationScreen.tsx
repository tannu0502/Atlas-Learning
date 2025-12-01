"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Notification, Module } from "../types"
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, mockModules } from "../data/mockData"

interface NotificationScreenProps {
  onBack: () => void
  onNavigateToModule: (module: Module) => void
}

export default function NotificationScreen({ onBack, onNavigateToModule }: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notifications from global state
    setNotifications(getNotifications())
  }, [])

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    const updatedNotifications = markNotificationAsRead(notification.id)
    setNotifications(updatedNotifications)

    // Navigate to module if it's a module-related notification
    if (notification.type === "module_assigned" || notification.type === "course_uploaded") {
      // Find the latest module (simulating the new module mentioned in notification)
      const latestModule = mockModules[0]
      onNavigateToModule(latestModule)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "module_assigned":
        return "book-outline"
      case "course_uploaded":
        return "school-outline"
      case "quiz_available":
        return "help-circle-outline"
      case "module_expired":
        return "time-outline"
      default:
        return "notifications-outline"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "module_assigned":
        return "#4CAF50"
      case "course_uploaded":
        return "#2196F3"
      case "quiz_available":
        return "#FF9800"
      case "module_expired":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const handleMarkAllRead = () => {
    const updatedNotifications = markAllNotificationsAsRead()
    setNotifications(updatedNotifications)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[styles.notificationCard, !notification.is_read && styles.unreadNotification]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationContent}>
                <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(notification.type) }]}>
                  <Ionicons name={getNotificationIcon(notification.type)} size={20} color="white" />
                </View>
                <View style={styles.notificationText}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{formatDate(notification.created_at)}</Text>
                </View>
                {!notification.is_read && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={60} color="#666" />
            <Text style={styles.emptyStateText}>No notifications</Text>
            <Text style={styles.emptyStateSubtext}>You're all caught up!</Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  markAllButton: {
    padding: 8,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  markAllText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationsList: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#b0b0b0",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#888888",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginTop: 5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 20,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
})
