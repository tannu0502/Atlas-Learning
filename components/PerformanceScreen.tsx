import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockModules } from "../data/mockData";
import type { Module } from "../types";

interface PerformanceScreenProps {
  onBack: () => void;
  onNavigateToModule: (module: Module) => void;
}

const toSentenceCase = (str: string) => {
  if (!str) return "";
  const lower = str.toLowerCase().replace("_", " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const getModuleStatus = (
  progress: { [contentId: string]: boolean },
  totalActivities: number
) => {
  const completedCount = Object.values(progress).filter(Boolean).length;
  if (completedCount === 0) return "not_started";
  if (completedCount < totalActivities) return "in_progress";
  return "completed";
};

const PerformanceScreen: React.FC<PerformanceScreenProps> = ({
  onBack,
  onNavigateToModule,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const styles = getStyles(isDarkMode);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [moduleDetails] = useState(mockModules);
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortByDate, setSortByDate] = useState<"asc" | "desc" | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [progressData, setProgressData] = useState<{
    [moduleId: string]: { [contentId: string]: boolean };
  }>({});

  // Load saved progress for all modules
  useEffect(() => {
    const loadProgressForAll = async () => {
      try {
        const progressObj: {
          [moduleId: string]: { [contentId: string]: boolean };
        } = {};
        for (const mod of mockModules) {
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

  // Dynamic counts for chart
  const dynamicCounts = moduleDetails.reduce(
    (acc, mod) => {
      const totalActivities = mod.activities?.length || 0;
      const computedStatus = getModuleStatus(
        progressData[mod.id] || {},
        totalActivities
      );

      if (computedStatus === "completed") acc.completed++;
      else if (computedStatus === "in_progress") acc.inProgress++;
      else if (computedStatus === "not_started") acc.notStarted++;
      else if (computedStatus === "expired") acc.expired++;

      acc.total++;
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, notStarted: 0, expired: 0 }
  );

  // Chart data
  const total = dynamicCounts.total;
  const completed = dynamicCounts.completed;
  const inProgress = dynamicCounts.inProgress;
  const notStarted = dynamicCounts.notStarted;
  const expired = dynamicCounts.expired;

  const completedPercent = completed / total || 0;
  const inProgressPercent = inProgress / total || 0;
  const notStartedPercent = notStarted / total || 0;
  const expiredPercent = expired / total || 0;

  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const completedLength = completedPercent * circumference;
  const inProgressLength = inProgressPercent * circumference;
  const notStartedLength = notStartedPercent * circumference;
  const expiredLength = expiredPercent * circumference;

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
      default:
        return "#ccc";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Meter</Text>
      </View>

      {/* DONUT CHART */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <View style={styles.chartWrapper}>
          <Svg height="150" width="150" viewBox="0 0 100 100">
            <G rotation="-90" origin="50, 50">
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#4CAF50"
                strokeWidth={strokeWidth}
                strokeDasharray={`${completedLength} ${circumference}`}
                strokeLinecap="round"
                fill="none"
                onPress={() => setSelectedSegment("completed")}
              />
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#FFC107"
                strokeWidth={strokeWidth}
                strokeDasharray={`${inProgressLength} ${circumference}`}
                strokeDashoffset={-completedLength}
                strokeLinecap="round"
                fill="none"
                onPress={() => setSelectedSegment("in_progress")}
              />
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#FF9800"
                strokeWidth={strokeWidth}
                strokeDasharray={`${notStartedLength} ${circumference}`}
                strokeDashoffset={-(completedLength + inProgressLength)}
                strokeLinecap="round"
                fill="none"
                onPress={() => setSelectedSegment("not_started")}
              />
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#03A9F4"
                strokeWidth={strokeWidth}
                strokeDasharray={`${expiredLength} ${circumference}`}
                strokeDashoffset={
                  -(completedLength + inProgressLength + notStartedLength)
                }
                strokeLinecap="round"
                fill="none"
                onPress={() => setSelectedSegment("expired")}
              />
            </G>
            <SvgText
              x="50"
              y="53"
              fontSize="6"
              fontWeight="bold"
              fill={isDarkMode ? "#fff" : "#000"}
              textAnchor="middle"
            >
              {`Total: ${total}`}
            </SvgText>
          </Svg>

          {selectedSegment && (
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Text
                style={{
                  color: isDarkMode ? "#fff" : "#000",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {(() => {
                  const labelMap: Record<string, string> = {
                    completed: "Completed",
                    in_progress: "In Progress",
                    not_started: "Not Started",
                    expired: "Expired",
                  };
                  const valueMap: Record<string, number> = {
                    completed,
                    in_progress: inProgress,
                    not_started: notStarted,
                    expired,
                  };
                  const percent = (
                    ((valueMap[selectedSegment] || 0) / total) *
                    100
                  ).toFixed(1);
                  return `${labelMap[selectedSegment]}: ${
                    valueMap[selectedSegment]
                  } Modules (${percent}%)`;
                })()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* LEGEND */}
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
          />
          <Text style={styles.legendText}>Completed: {completed}</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: "#FFC107" }]}
          />
          <Text style={styles.legendText}>In Progress: {inProgress}</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: "#FF9800" }]}
          />
          <Text style={styles.legendText}>Not Started: {notStarted}</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: "#03A9F4" }]}
          />
          <Text style={styles.legendText}>Expired: {expired}</Text>
        </View>
      </View>

      {/* MODULE DETAILS BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModuleDetails(!showModuleDetails)}
      >
        <Text style={styles.buttonText}>View Module Details</Text>
      </TouchableOpacity>

      {/* MODULE DETAILS LIST */}
      {showModuleDetails && (
        <View>
          {/* Filter and Sort */}
          <View style={styles.filterSortRow}>
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              style={styles.iconButton}
            >
              <Ionicons name="filter" size={20} color="#fff" />
              <Text style={styles.iconText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setSortByDate((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              style={styles.iconButton}
            >
              <Ionicons name="swap-vertical" size={20} color="#fff" />
              <Text style={styles.iconText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={styles.filterButtonsContainer}>
              {["all", "completed", "in_progress", "not_started", "expired"].map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() =>
                      setFilterStatus(status === "all" ? null : status)
                    }
                  >
                    <Text
                      style={{
                        color: getStatusColor(
                          status === "all" ? "" : status
                        ),
                        marginRight: 16,
                      }}
                    >
                      {status === "all"
                        ? "All"
                        : status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          <Text style={styles.sectionTitle}>Module Details</Text>

          {moduleDetails
            .filter((item) => {
              const totalActivities = item.activities?.length || 0;
              const computedStatus = getModuleStatus(
                progressData[item.id] || {},
                totalActivities
              );
              return !filterStatus || computedStatus === filterStatus;
            })
            .sort((a, b) => {
              if (!sortByDate) return 0;
              const dateA = new Date(a.published_at || "").getTime();
              const dateB = new Date(b.published_at || "").getTime();
              return sortByDate === "asc" ? dateA - dateB : dateB - dateA;
            })
            .map((item) => {
              const totalActivities = item.activities?.length || 0;
              const computedStatus = getModuleStatus(
                progressData[item.id] || {},
                totalActivities
              );
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onNavigateToModule(item)}
                  style={styles.moduleCard}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.imagePlaceholder}>
                      {item.image_url ? (
                        <Image
                          source={{ uri: item.image_url }}
                          style={styles.moduleImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name={
                            item.type === "video"
                              ? "play-circle-outline"
                              : item.type === "document"
                              ? "document-text-outline"
                              : "help-circle-outline"
                          }
                          size={40}
                          color="#888"
                        />
                      )}
                      <Text style={styles.moduleMeta}>
                        Module | {totalActivities}{" "}
                        {totalActivities === 1 ? "Activity" : "Activities"}
                      </Text>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <Text style={styles.courseTitle}>
                        Course: {item.course_name ?? "Unknown Course"}
                      </Text>
                      <Text style={styles.moduleTitle}>{item.title}</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: getStatusColor(computedStatus),
                          }}
                        >
                          {toSentenceCase(computedStatus)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: getStatusColor(computedStatus),
                          marginBottom: 6,
                          marginTop: 50,
                        }}
                      />
                      <Text style={styles.publishDateRight}>
                        Published on: {formatDate(item.published_at || "")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </ScrollView>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDarkMode ? "#121212" : "#ffffff",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    backButton: {
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
    },
    chartContainer: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 8,
    },
    chartWrapper: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 16,
    },
    chartLegend: {
      flexDirection: "column",
      gap: 8,
      marginTop: 12,
      marginBottom: 20,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: 4,
      marginRight: 8,
    },
    legendText: {
      color: isDarkMode ? "#fff" : "#000",
    },
    button: {
      backgroundColor: "#f41414ff",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 16,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    filterSortRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    iconButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    iconText: {
      color: "#fff",
      marginLeft: 6,
    },
    filterButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 12,
    },
    moduleCard: {
      flexDirection: "column",
      backgroundColor: isDarkMode ? "#1e1e1e" : "#110707ff",
      padding: 8,
      borderRadius: 8,
      marginBottom: 12,
    },
    imagePlaceholder: {
      width: 100,
      borderRadius: 8,
      backgroundColor: isDarkMode ? "#333" : "#ddd",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      paddingVertical: 10,
      flexDirection: "column",
      gap: 8,
    },
    moduleImage: {
      width: 100,
      height: 80,
      borderRadius: 8,
      marginBottom: 8,
    },
    moduleMeta: {
      fontSize: 12,
      color: isDarkMode ? "#ccc" : "#333",
      marginTop: 6,
      textAlign: "center",
    },
    courseTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: isDarkMode ? "#bbb" : "#000",
    },
    moduleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDarkMode ? "#fff" : "#000",
    },
    publishDateRight: {
      fontSize: 11,
      color: isDarkMode ? "#aaa" : "#666",
      textAlign: "right",
      marginTop: 12,
    },
  });

export default PerformanceScreen;
