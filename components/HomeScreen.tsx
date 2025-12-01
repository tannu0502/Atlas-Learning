"use client"

import { useRef,useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  Image,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Module, Course } from "../types"
import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockModules, mockCourses, getCurrentProfile, getUnreadNotificationCount, mockLatestModules } from "../data/mockData"
const { width: screenWidth } = Dimensions.get("window")

interface HomeScreenProps {
  onNavigateToProfile: () => void
  onNavigateToPerformance: () => void
  onNavigateToModule: (module: Module) => void
  onViewAllModules: (type: string) => void
  onViewAllCourses: () => void
  onNavigateToNotifications: () => void
  onNavigateToCourse: (course: Course) => void
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToProfile,
  onNavigateToPerformance,
  onNavigateToModule,
  onViewAllModules,
  onViewAllCourses,
  onNavigateToNotifications,
  onNavigateToCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [primeModules, setPrimeModules] = useState<Module[]>([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Module>>(null);
  const [latestModules, setLatestModules] = useState<Module[]>([])
  const [progressModules, setProgressModules] = useState<Module[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [currentProfile, setCurrentProfile] = useState(getCurrentProfile())
  const handleClear = () => {
  setSearchQuery(""); 
};
  useEffect(() => {
  // prime + latest + courses + profile/notifications (same as before)
  setPrimeModules(mockModules.filter((m) => m.is_prime).slice(0, 6));
  setLatestModules(mockLatestModules);
  setCourses(mockCourses);
  setCurrentProfile(getCurrentProfile());
  setUnreadNotifications(getUnreadNotificationCount());

  // dynamic in-progress (async)
  updateProgressModules();
}, []);

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, primeModules.length - 1);
    flatListRef.current?.scrollToIndex({ index: nextIndex });
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    flatListRef.current?.scrollToIndex({ index: prevIndex });
    setCurrentIndex(prevIndex);
  };

  //  this useEffect to refresh profile data and notifications
useEffect(() => {
  const refreshData = () => {
    setCurrentProfile(getCurrentProfile());
    setUnreadNotifications(getUnreadNotificationCount());
    // update in-progress list in background (no await)
    updateProgressModules();
  };

  // Refresh data now
  refreshData();

  // Set up interval to check for updates
  const interval = setInterval(refreshData, 1000); // 1000ms is okay; increase if needed

  return () => clearInterval(interval);
}, []);

// -------------------- add this --------------------
const updateProgressModules = async () => {
  try {
    const allModules = [...mockModules, ...mockLatestModules];

    const results = await Promise.all(
      allModules.map(async (m) => {
        // module id fallback (some data uses module_id)
        const moduleId = (m as any).id ?? (m as any).module_id ?? (m as any).moduleId;
        // 1) explicit status in stored keys
        const storedStatus = await AsyncStorage.getItem(`status_${moduleId}`);
        if (storedStatus === "in_progress") return m;

        // 2) stored progress object (used in ActivityDetailScreen: progress_<moduleId>)
        const storedProgress = await AsyncStorage.getItem(`progress_${moduleId}`);
        const parsed = storedProgress ? JSON.parse(storedProgress) : null;

        // count how many completed activity keys exist in progress object
        const completedCount =
          parsed && typeof parsed === "object" ? Object.keys(parsed).length : 0;

        // total activities for module (if available in mock data)
        const totalActivities = m.activities?.length ?? 0;

        // if we have activity list, treat module as in-progress when some but not all are done
        if (totalActivities > 0) {
          if (completedCount > 0 && completedCount < totalActivities) return m;
          // if completedCount === totalActivities -> completed -> don't include
        } else {
          // fallback: check stored percent key (if your app sets a percent somewhere)
          const percentVal = await AsyncStorage.getItem(`progressPercent_${moduleId}`);
          if (percentVal) {
            const pct = Number(percentVal);
            if (pct > 0 && pct < 100) return m;
          }
        }

        // fallback to module.status from mock data (a static fallback)
        if (m.status === "in_progress") return m;

        return null;
      })
    );

    const filtered = results.filter(Boolean) as Module[];
    setProgressModules(filtered);
  } catch (err) {
    console.error("updateProgressModules error:", err);
  }
};
// -------------------- end add --------------------

  const filteredModules = searchQuery
    ? mockModules.filter(
        (module) =>
          module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockModules

  const getModuleImage = (module: Module) => {
    // Generate different placeholder images based on module type and id
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]
    const colorIndex = Number.parseInt(module.id) % colors.length
    return colors[colorIndex]
  }
  const renderPrimeModule = ({ item }: { item: Module }) => (
    <TouchableOpacity
      style={[styles.primeModuleCard, { width: screenWidth - 40 }]}
      onPress={() => onNavigateToModule(item)}
    >
     <View style={styles.primeModuleImageContainer}>
        {item.image_url ? (
        <Image
          source={{uri:item.image_url}}
          style={styles.primeModuleImage}
          resizeMode="cover"
          />
        ) : (
      <Ionicons name="play-circle" size={60} color="rgba(255,255,255,0.9)" />
      )}
    </View>

    {/* ✅ Arrow and pagination below image but above title */}
    <View style={styles.arrowContainer}>
    <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
      <Text style={{ color: currentIndex === 0 ? "#555" : "white", fontSize: 16 }}>←</Text>
    </TouchableOpacity>

    <Text style={{ color: "white", marginHorizontal: 10 }}>
      {currentIndex + 1}/{primeModules.length}
    </Text>

    <TouchableOpacity onPress={handleNext} disabled={currentIndex >= primeModules.length - 1}>
      <Text style={{ color: currentIndex >= primeModules.length - 1 ? "#555" : "white", fontSize: 16 }}>→</Text>
    </TouchableOpacity>
  </View>
      <View style={styles.primeModuleContent}>
        <Text style={[styles.primeModuleTitle,{textAlign:"center"}]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.published_at && (
            <Text style={styles.primeModulePublishedDate}>{item.published_at}</Text>
        )}
        <Text style={styles.primeModuleDate}>{item.created_at}</Text>
        <View style={styles.primeModuleMeta}>
          {false && (
          <Text style={styles.primeModuleDuration}>{item.duration}</Text>)}
        </View>
      </View>

    </TouchableOpacity>
  )
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

  const getModuleIcon = (type: string) => {
    switch (type) {
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

  // Extract first name from full name
  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0]
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
            <View style={{ flexDirection: "column" }}>
                <Text style={styles.logo}>Atlas</Text>
                <Text style={styles.subLogo}>     By Airtel</Text>
              </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton} onPress={onNavigateToNotifications}>
            <Ionicons name="notifications" size={24} color="#ffffff" />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={onNavigateToPerformance}>
            <Ionicons name="analytics" size={24} color="#ffffff" />
          </TouchableOpacity>

          {/* Update the profile icon in the top bar */}
          <TouchableOpacity style={styles.iconButton} onPress={onNavigateToProfile}>
            {currentProfile.avatar ? (
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: currentProfile.avatar || "https://via.placeholder.com/150" }}
                  style={styles.profileImage}
                />

              </View>
            ) : (
              <Ionicons name="person-circle" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back, {getFirstName(currentProfile.full_name)}! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Continue your learning journey</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#b0b0b0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search modules, courses..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery && (
          <TouchableOpacity
            onPress={handleClear}
            style={[
              styles.clearButton,
              Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null,
            ]}
          >
            <Ionicons name="close-circle" size={20} color="#b0b0b0" />
          </TouchableOpacity>

        )}
      </View>

      {/* Search Results */}
      {searchQuery && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Search Results ({filteredModules.length})
            </Text>
          {filteredModules.length > 0 ? (
            filteredModules.map((item) => (
              <TouchableOpacity 
                key={`search_${item.id}`} 
                style={styles.searchResultCard} 
                onPress={() => {
                  onNavigateToModule(item);
                  updateProgressModules();
                }}
              >
                <View style={[styles.searchResultImage, { backgroundColor: getModuleImage(item) }]}>
                  <Ionicons name={getModuleIcon(item.type)} size={20} color="rgba(255,255,255,0.9)" />
                </View>
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle}>{item.title}</Text>
                  <Text style={styles.searchResultDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.searchResultMeta}>
                    <Text style={styles.searchResultDuration}>{item.duration}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || "not_started") }]}>
                  <Text style={styles.statusText}>
                    {(item.status || "not_started").replace("_", " ").toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={50} color="#666" />
              <Text style={styles.emptyStateText}>No modules found</Text>
              <Text style={styles.emptyStateSubtext}>Try searching with different keywords</Text>
            </View>
          )}
        </View>
      )}

      {!searchQuery && (
        <>
          {/* Prime Modules Carousel */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prime Modules</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={primeModules}
          renderItem={renderPrimeModule}
          keyExtractor={(item) => `prime_${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentIndex(index);
          }}
          onScroll={(event) => { // ✅ This catches web drags
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            if (index !== currentIndex) {
              setCurrentIndex(index);
            }
          }}
          scrollEventThrottle={16}
        />
      </View>

          {/* Latest Modules */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Modules</Text>
              <TouchableOpacity onPress={() => onViewAllModules("latest")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.latestModulesScrollContainer}
            >
            {latestModules.map((item) => (
           <View key={`latest_${item.id}`} style={{ alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity 
              style={styles.latestModuleWrapper} 
              onPress={() => onNavigateToModule(item)}
              >
            <View style={[styles.latestModuleImage, { backgroundColor: getModuleImage(item) }]}>
            <Ionicons 
               name={getModuleIcon(item.type)} 
               size={24} 
               color="rgba(255,255,255,0.9)" 
            />
            </View>
            </TouchableOpacity>
          <Text style={styles.latestModuleTitleOutside}>
          {item.title}
          </Text>
          </View>

          ))}
        </ScrollView>
          </View>
         {/* Modules in Progress */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Module In Progress</Text>
              <TouchableOpacity onPress={() => onViewAllModules("progress")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {progressModules.length > 0 ? (
              <FlatList
                data={progressModules}
                keyExtractor={(item) => `progress_${item.id}`}
                renderItem={({ item }) => (
                  <View style={{ alignItems: "center", marginHorizontal: 10 }}>
                    <TouchableOpacity
                      style={styles.progressModuleWrapper}
                      onPress={() => onNavigateToModule(item)}
                    >
                    <View style={[styles.progressModuleImageHorizontal, { backgroundColor: getModuleImage(item) }]}>
                      <Ionicons name={getModuleIcon(item.type)} size={30} color="rgba(255,255,255,0.9)" />
                    </View>
                    </TouchableOpacity>
                    <Text style={styles.progressModuleTitleBelow}>{item.title}</Text>
                    </View>
                  )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 20 }}
                />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={50} color="#666" />
                <Text style={styles.emptyStateText}>No modules in progress</Text>
                <Text style={styles.emptyStateSubtext}>Start learning to see your progress here</Text>
              </View>
            )}
          </View>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.sectionTitle, { textAlign: "center" }]}>Courses</Text>
          </View>

         {/* Only Prashant Section */}
          {mockLatestModules.filter(m =>
            m.course_name?.toLowerCase().includes("only prashant")
          ).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Only Prashant</Text>
                <TouchableOpacity
                  onPress={() =>
                    onViewAllModules("Only Prashant")
                  }
                >
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={mockLatestModules.filter(m =>
                  m.course_name?.toLowerCase().includes("only prashant")
                )}
                keyExtractor={(item) => `onlyprashant_${item.id}`}
                renderItem={({ item }) => (
                  <View style={{ alignItems: "center", marginHorizontal: 10 }}>
                    <TouchableOpacity
                      style={styles.progressModuleWrapper}
                      onPress={() => onNavigateToModule(item)}
                    >
                      <View
                        style={[
                          styles.progressModuleImageHorizontal,
                          { backgroundColor: getModuleImage(item) }
                        ]}
                      >
                        <Ionicons
                          name={getModuleIcon(item.type)}
                          size={30}
                          color="rgba(255,255,255,0.9)"
                        />
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.progressModuleTitleBelow}>{item.title}</Text>
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
              />
            </View>
          )}


          {/* Courses */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Courses 🎓</Text>
              <TouchableOpacity onPress={onViewAllCourses}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {courses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => onNavigateToCourse(course)}>
                <View style={styles.courseContent}>
                  <View style={[styles.courseImage, { backgroundColor: getModuleImage({ id: course.id } as Module) }]}>
                    <Ionicons name="school" size={30} color="rgba(255,255,255,0.9)" />
                  </View>
                  <View style={styles.courseInfo}>
                    <View style={styles.courseHeader}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                    </View>
                    <Text style={styles.courseDescription}>{course.description}</Text>
                    <View style={styles.courseFooter}>
                      <Text style={styles.courseModuleCount}>{course.modules?.length || 0} modules</Text>
                      <Text style={styles.courseDuration}>{course.duration}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    minHeight: Platform.OS === "web" ? 100 : undefined,
  },
  carouselWrapper: {
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 20,
},

  primeModuleDate: {
    fontSize: 16,
    color: "rgba(219, 213, 245, 1)",
    marginTop: 5,
    textAlign: "center", 
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 20 : 50,
    paddingBottom: 15,
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f22525ff",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  subLogo: {
  fontSize: 14,
  color: "#ffffff",
  opacity: 0.8,
  marginTop: -2, 
},

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    marginLeft: 15,
    position: "relative",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  welcomeSection: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: "#b0b0b0",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
  flex: 1,
  paddingVertical: 12,
  fontSize: 16,
  color: "#ffffff",
  ...(Platform.OS === "web" ? { outlineWidth: 0 } : {}), // ✅ FIXED
},


  clearButton: {
    padding: 5,
    ...(Platform.OS === "web" && { cursor: "pointer" }),
  },

  section: {
    marginBottom: 25,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf:"center",
  },
 arrowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap:10,
    marginTop: 10,
  },
  viewAllText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
primeModulePublishedDate: {
  fontSize: 14,
  color: "#b0b0b0",
  textAlign: "center",
},

  searchResultCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#2a2a2a",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },

  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  searchResultContent: {
    flex: 1,
  },

  searchResultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },

  searchResultDescription: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 8,
  },

  searchResultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchResultDuration: {
    fontSize: 12,
    color: "#888888",
  },

  primeCarouselContainer: {
    paddingLeft: 20,
  },

  primeModuleCard: {
    width: screenWidth - 60,
    marginRight: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 10,
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },

  moduleImagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
  },

  primeLabel: {
    position: "absolute",
    top: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  primeLabelText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 4,
  },

  primeModuleContent: {
    paddingVertical: 6,
  },

  primeModuleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  primeModuleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  primeModuleDuration: {
    fontSize: 14,
    color: "#b0b0b0",
  },

  primeModuleImageContainer: {
  width: "100%",
  height: 180,
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#444", // fallback if image missing
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
},

  primeModuleImage: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
},

progressModuleWrapper: {
  alignItems: 'center',
  width: 160,
  height: 160,
  marginHorizontal: 10,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#2a2a2a',
  justifyContent: 'center',
  padding: 8,
},

progressModuleImageHorizontal: {
  width: 140,
  height: 100,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
},

progressModuleTitleBelow: {
  fontSize: 14,
  color: '#ffffff',
  marginTop: 8,
  maxWidth: 140,
  textAlign: 'center',
},

statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  alignSelf: "flex-start",
  },

statusText: {
  color: "white",
  fontSize: 10,
  fontWeight: "bold",
  },

latestModulesGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 15,
  },

latestModuleWrapper: {
  alignItems: 'center',
  width: 160,
  height: 160,
  marginHorizontal:10,
  borderRadius: 80, // half of width/height
  margin: 10,
  marginBottom:20,
  overflow: 'hidden',
  backgroundColor: '#08060cff', 
  justifyContent: 'center',
  marginRight:0,
  paddingBottom:8,
  },
latestModuleCard: {
  width:100,
  height:100,
  justifyContent:"center",
  backgroundColor: "#9e2121ff",
  borderRadius:50,
  padding: 15,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
  elevation: 2,
  marginRight:16,
  marginBottom: 10,
  marginHorizontal:8,
  cursor: Platform.OS === "web" ? "pointer" : undefined,
  },

latestModuleImage: {
  width:140,
  height:140,
  borderRadius:70,
  justifyContent: "center",
  alignItems: "center",
  marginTop:10,
  marginBottom: 8,
  },

  latestModuleTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 4,
  },

  latestModuleTitleOutside: {
  fontSize: 17,
  fontWeight: '600',
  textAlign: 'center',
  color: '#ffffff',
  marginTop: 8,
  width:90,
  alignSelf:"center",
  flexWrap:"wrap",
  lineHeight:16,
  maxWidth: 100,
},

  latestModuleDuration: {
    fontSize: 12,
    color: "#b0b0b0",
    textAlign: "center",
  },

  latestModulesScrollContainer: {
  flexDirection: 'row',
  paddingHorizontal: 10,
  },

  progressModuleCard: {
    backgroundColor: "#2a2a2a",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },

  progressModuleContent: {
    flexDirection: "row",
    padding: 15,
  },

  progressModuleImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  progressModuleInfo: {
    flex: 1,
  },

  progressModuleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  progressModuleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },

  progressModuleDuration: {
    fontSize: 12,
    color: "#b0b0b0",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#404040",
    borderRadius: 3,
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },

  progressModuleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressText: {
    fontSize: 12,
    color: "#b0b0b0",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 20,
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

  courseCard: {
    backgroundColor: "#2a2a2a",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },

  courseContent: {
    flexDirection: "row",
    padding: 15,
  },

  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  courseInfo: {
    flex: 1,
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

  profileImageContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as any,
  },
  leftArrow: {
  position: "absolute",
  left: 10,
  top: "50%",
  transform: [{ translateY: -20 }],
  zIndex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: 20,
  padding: 8,
},
rightArrow: {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: [{ translateY: -20 }],
  zIndex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: 20,
  padding: 8,
},
viewAll: {
  color: "#007AFF",
  fontSize: 14,
  fontWeight: "600",
},

})
export default HomeScreen;