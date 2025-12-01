"use client";

import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Module, Course, LatestModule } from "../types";
import { mockModules, mockCourses, mockLatestModules } from "../data/mockData";

interface ViewAllScreenProps {
  onBack: () => void;
  onNavigateToModule: (module: Module) => void;
  onNavigateToCourse?: (course: Course) => void;
  type: "prime" | "latest" | "progress" | "courses"|"Only Prashant";
}

// === SAME HELPER AS ModuleDetailScreen ===
const getModuleStatus = (progress: { [contentId: string]: boolean }, totalActivities: number) => {
  const completedCount = Object.values(progress).filter(Boolean).length;
  if (completedCount === 0) return "not_started";
  if (completedCount < totalActivities) return "in_progress";
  return "completed";
};
const isLatestModule = (item: Module | LatestModule): item is LatestModule => {
  return "activities" in item && "published_at" in item;
};

export default function ViewAllScreen({ onBack, onNavigateToModule, type, onNavigateToCourse }: ViewAllScreenProps) {
  const [data, setData] = useState<(Module | LatestModule | Course)[]>([]);
  const [title, setTitle] = useState("");
  const [progressData, setProgressData] = useState<{ [moduleId: string]: { [contentId: string]: boolean } }>({});
  const isLatestStyled = type === "latest" ||type==="progress" ||type === "Only Prashant";
  const isProgressType = type === "progress";

  useEffect(() => {
    switch (type) {
      case "prime":
        setData(mockLatestModules);
        setTitle("Latest Modules");
        break;
      case "progress": {
          const allModules = [...mockModules, ...mockLatestModules];

          const filtered = allModules.filter((mod) => {
            const progress = progressData[mod.id] || {};
            const totalActivities = isLatestModule(mod) ? mod.activities?.length || 0 : 0;
            const status = getModuleStatus(progress, totalActivities);
            return status === "in_progress";
          });

          setData(filtered);
          setTitle("Modules in Progress");
          break;
        }

      case "courses":
        setData(mockCourses);
        setTitle("All Courses");
        break;

      case "latest":
        setData(mockLatestModules);
        setTitle("Latest Modules");
        break;
      case "Only Prashant":
        setData(
          mockLatestModules.filter(m =>
            m.course_name?.toLowerCase().includes("only prashant")
          )
        );
        setTitle("Only Prashant");
        break;

      default:
        setData(mockModules);
        setTitle("All Modules");
    }
  }, [type,progressData]);

  // === LOAD PROGRESS FOR ALL MODULES ===
  useEffect(() => {
    const loadProgressForAll = async () => {
      try {
        const allModules = [...mockModules, ...mockLatestModules];
        const progressObj: { [moduleId: string]: { [contentId: string]: boolean } } = {};

        for (const mod of allModules) {
          const saved = await AsyncStorage.getItem(`progress_${mod.id}`);
          progressObj[mod.id] = saved ? JSON.parse(saved) : {};
        }

        setProgressData(progressObj);
      } catch (error) {
        console.error("Error loading progress data:", error);
      }
    };

    loadProgressForAll();
  }, []);

  const getModuleImage = (item: Module | Course) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
    const colorIndex = Number.parseInt(item.id) % colors.length;
    return colors[colorIndex];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "in_progress":
        return "#eec719ff";
      case "expired":
        return "#F44336";
      case "not_started":
        return "#fa5c2cff";
      default:
        return "#9E9E9E";
    }
  };

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case "video":
        return "play-circle-outline";
      case "image":
        return "image-outline";
      case "document":
        return "document-text-outline";
      case "quiz":
        return "help-circle-outline";
      default:
        return "book-outline";
    }
  };

  const renderModuleItem = ({ item }: { item: Module }) => {
    const totalActivities = isLatestModule(item) ? item.activities?.length || 0 : 0;
    const computedStatus = getModuleStatus(progressData[item.id] || {}, totalActivities);

    return (
      <TouchableOpacity style={styles.moduleCard} onPress={() => onNavigateToModule(item)}>
        {/* LEFT IMAGE SECTION */}
        <View style={{ alignItems: "center", marginLeft: 10 }}>
          <View style={[styles.moduleImage, { backgroundColor: getModuleImage(item) }]}>
            <Ionicons name={getModuleIcon(item.type)} size={28} color="rgba(255,255,255,0.9)" />
            {item.is_prime && (
              <View style={styles.primeLabel}>
                <Ionicons name="star" size={10} color="#FFD700" />
              </View>
            )}
          </View>

          {isLatestStyled && isLatestModule(item) && (
  <Text style={styles.activityText}>
    Module | {totalActivities} {totalActivities === 1 ? "Activity" : "Activities"}
  </Text>
)}

        </View>

        {/* RIGHT CONTENT SECTION */}
        <View style={styles.moduleContent}>
          {isLatestStyled && isLatestModule(item) && item.course_name && (
            <Text style={styles.courseName}>Course: {item.course_name}</Text>
          )}

          <View style={styles.titleBlock}>
            <Text style={styles.moduleTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          {type !== "courses" && (
            <View style={{ marginTop: 4, alignSelf: "flex-start" }}>
              <Text style={styles.statusText}>{computedStatus.replace("_", " ").toUpperCase()}</Text>
            </View>
          )}

          {(isLatestStyled || isProgressType) && isLatestModule(item) && item.published_at && (
            <View style={styles.publishedWrapper}>
              <View style={[styles.hollowCircle, { borderColor: getStatusColor(computedStatus) }]} />
              <Text style={styles.publishedDate}>
                Published on: {new Date(item.published_at).toLocaleDateString()}
              </Text>
            </View>
          )}

          <Text style={styles.moduleDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.moduleMeta}>
            <Text style={styles.moduleDuration}>{item.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard} onPress={() => onNavigateToCourse && onNavigateToCourse(item)}>
      <View style={[styles.courseImage, { backgroundColor: getModuleImage(item) }]}>
        <Ionicons name="school" size={24} color="rgba(255,255,255,0.9)" />
      </View>
      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title}</Text>
        </View>
        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.courseFooter}>
          <Text style={styles.courseModuleCount}>{item.modules?.length || 0} modules</Text>
          <Text style={styles.courseDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {type === "courses" ? (
        <FlatList
          data={data as Course[]}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={data as Module[]}
          renderItem={renderModuleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    minHeight: Platform.OS === "web" ? Dimensions.get("window").height : undefined,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 20 : 50,
    paddingBottom: 20,
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
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
  listContainer: {
    padding: 20,
  },
  moduleCard: {
    flexDirection: "row",
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
  moduleImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  primeLabel: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 2,
  },
  moduleContent: {
    flex: 1,
    padding: 15,
    position: "relative",
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 8,
    lineHeight: 18,
  },
  moduleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moduleDuration: {
    fontSize: 12,
    color: "#b0b0b0",
  },
  statusText: {
    color: "white",
    fontSize: 10,
  },
  courseCard: {
    flexDirection: "row",
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
  courseImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  courseContent: {
    flex: 1,
    padding: 15,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  courseDescription: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 8,
    lineHeight: 18,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseModuleCount: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
  },
  courseDuration: {
    fontSize: 12,
    color: "#b0b0b0",
  },
  courseName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  titleBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  publishedWrapper: {
    position: "absolute",
    bottom: 15,
    right: 15,
    alignItems: "center",
  },
  hollowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginBottom: 4,
  },
  publishedDate: {
    fontSize: 11,
    color: "#cccccc",
  },
  activityText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
    textAlign: "center",
  },
});
