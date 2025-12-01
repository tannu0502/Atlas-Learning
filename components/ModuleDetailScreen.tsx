"use client"
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useState } from "react"
import { View, Text,Image, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { mockModuleContent, mockContentProgress } from "../data/mockData"
import type { Module, ModuleContent } from "../types"

interface ModuleDetailScreenProps {
  module: Module
  onBack: () => void
  onNavigateToActivity: (activity: ModuleContent) => void
}
const getModuleIcon = (type: string) => {
  switch (type) {
    case "video": return "play-circle-outline";
    case "image": return "image-outline";
    case "document": return "document-text-outline";
    case "quiz": return "help-circle-outline";
    default: return "book-outline";
  }
};
const getStatusColor = (status: string) => { 
  switch (status) {
    case "completed": 
      return "#4CAF50";
    case "in_progress": 
      return "#FFC107";
    case "not_started": 
      return "#FF9800";
    case "expired": 
      return "#03A9F4";
    default: return "#9E9E9E"; // gray for unknown
  }
};
const toSentenceCase = (str: string) => { 
  if (!str) return "";
  const lower = str.toLowerCase().replace("_", " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};
const getModuleStatus = (progress: { [contentId: string]: boolean }, totalActivities: number) => {
  const completedCount = Object.values(progress).filter(Boolean).length;

  if (completedCount === 0) {
    return "not_started";
  } else if (completedCount < totalActivities) {
    return "in_progress";
  } else {
    return "completed";
  }
};

export default function ModuleDetailScreen({ module, onBack, onNavigateToActivity }: ModuleDetailScreenProps) {
  const [moduleContent, setModuleContent] = useState<ModuleContent[]>([])
  const [contentProgress, setContentProgress] = useState<{ [contentId: string]: boolean }>({})

  useEffect(() => {
  const content = module.activities?.length
    ? module.activities
    : mockModuleContent[module.id] || [];
  setModuleContent(content ?? []);
const loadProgress = async () => {
  try {
    let saved: { [contentId: string]: boolean } = {};
    const stored = await AsyncStorage.getItem(`progress_${module.id}`);
    if (stored) {
      saved = JSON.parse(stored);
    }

    for (const activity of module.activities ?? []) {
      if (activity.type === "quiz") {
        const passed = await AsyncStorage.getItem(`quizPassed_${activity.id}`);
        if (passed === "true") {
          saved[activity.id] = true;
        }
      }
    }

    setContentProgress(saved);
    await AsyncStorage.setItem(`progress_${module.id}`, JSON.stringify(saved));
  } catch (error) {
    console.error("Error loading progress:", error);
  }
};
  loadProgress();
}, [module.id]);


  const isContentAccessible = (content: ModuleContent) => true

  const markContentAsCompleted = (contentId: string) => {
    setContentProgress((prev) => ({
      ...prev,
      [contentId]: true,
    }))
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return "videocam"
      case "pdf": return "document-text"
      case "image": return "image"
      case "audio": return "musical-notes"
      case "quiz": return "help-circle"
      default: return "document"
    }
  }

  const getContentColor = (type: string) => {
    switch (type) {
      case "video": return "#FF6B6B"
      case "pdf": return "#4ECDC4"
      case "image": return "#45B7D1"
      case "audio": return "#96CEB4"
      case "quiz": return "#FFEAA7"
      default: return "#DDA0DD"
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        </View>
        {module.image_url ? (
        <Image
          source={{ uri: module.image_url }}
          style={styles.headerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.headerImage, styles.fallbackIcon]}>
        <Ionicons name={getModuleIcon(module.type)} size={64} color="#888" />
        </View>
      )}
    </View>
      <View style={styles.content}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.moduleInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={[styles.moduleStatus, { marginLeft: 10 }]}>
              {toSentenceCase(getModuleStatus(contentProgress, moduleContent.length))}
            </Text>
          </View>
            <Text style={styles.activityCount}>{moduleContent.length} Activity</Text>
            <Text style={styles.moduleDescriptionLabel}>Module Description</Text>
            <Text style={styles.moduleDescriptionText}>{module.description || "test"}</Text>
          </View>

          {moduleContent.map((content) => {
            const isCompleted = contentProgress[content.id]
            const iconName = getContentIcon(content.type)
            const bgColor = getContentColor(content.type)

            return (
              <TouchableOpacity
                key={content.id}
                style={[styles.activityCard, { backgroundColor: "#000" }]}
               onPress={async () => {
                    try {
                      if (content.type === "quiz") {
                        // Navigate to quiz and pass markCompleted callback
                        onNavigateToActivity({
                          ...content,
                          module_id: module.id, // ensure ActivityDetailScreen knows module
                        });
                      } else {
                        // Non-quiz activities: mark complete immediately
                        const updated = { ...contentProgress, [content.id]: true };
                        setContentProgress(updated);
                        await AsyncStorage.setItem(`progress_${module.id}`, JSON.stringify(updated));
                        onNavigateToActivity(content);
                      }
                    } catch (error) {
                      console.error("Error saving progress:", error);
                    }
                  }}
              >
                <Ionicons name={iconName} size={28} color="#fff" />
                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text style={styles.activityTitle}>{content.title}</Text>
                  <Text style={styles.activityTime}>0 min</Text>
                </View>
                <Ionicons
                  name={isCompleted ? "ellipse-outline" : "ellipse-outline"}
                  size={24}
                  color={
                    isCompleted
                    ? "#4CAF50"
                    : getStatusColor(
                       getModuleStatus(contentProgress, moduleContent.length)
                    )
                  }
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
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
  backButtonWrapper: {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 10,
},
  backButton: {
    padding: 8,
    backgroundColor: "rgba(244, 9, 9, 0.1)",
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
  fallbackIcon: {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c2c",
},

  contentContainer: {
    flex: 1,
    padding: 20,
  },
  moduleInfo: {
    marginBottom: 20,
  },
  titleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:'space-between',
  width:'100%',
},

  moduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  moduleStatus: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#b0b0b0",
},
  activityCount: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 10,
  },
  moduleDescriptionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  moduleDescriptionText: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  activityTime: {
    fontSize: 12,
    color: "#ddd",
  },
  headerImage: {
  width: '100%',
  height: 200,
  resizeMode:'cover',
  borderRadius: 0,
},

})
