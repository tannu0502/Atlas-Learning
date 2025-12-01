"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getCurrentProfile, updateProfile, mockQuizScores } from "../data/mockData"


interface ProfileScreenProps {
  onBack: () => void
  onLogout: () => void
}

export default function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const [profile, setProfile] = useState(getCurrentProfile())
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(getCurrentProfile())
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [quizScores] = useState(mockQuizScores)

  // Update profile when component mounts to get latest data
  useEffect(() => {
    const currentProfile = getCurrentProfile()
    setProfile(currentProfile)
    setEditedProfile(currentProfile)
  }, [])

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`)
    } else {
      console.log(`${title}: ${message}`)
    }
  }

  const handleImageUpload = () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            const updatedProfile = { ...profile, avatar: imageUrl }

            // Update all states immediately
            setProfile(updatedProfile)
            setEditedProfile(updatedProfile)

            // Update global state and save to storage
            updateProfile(updatedProfile)

            showAlert("Success", "Profile image updated and saved!")
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    } else {
      showAlert("Info", "Image upload would open camera/gallery picker on mobile")
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update global state and save to storage
      const savedProfile = updateProfile(editedProfile)
      setProfile(savedProfile)

      setIsEditing(false)
      setNewPassword("")
      setConfirmPassword("")
      setLoading(false)
      showAlert("Success", "Profile updated and saved successfully")
    }, 1000)
  }

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to logout?")) {
        showAlert("Success", "Logged out successfully")
        onLogout()
      }
    } else {
      showAlert("Success", "Logged out successfully")
      onLogout()
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Ionicons name={isEditing ? "close" : "create"} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={handleImageUpload}>
          <View style={styles.avatar}>
            {profile.avatar ? (
              <img
                src={profile.avatar || "/placeholder.svg"}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 50,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Ionicons name="person" size={60} color="#b0b0b0" />
            )}
          </View>
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={20} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{profile.full_name}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>
        <View style={styles.memberSince}>
          <Ionicons name="calendar-outline" size={16} color="#b0b0b0" />
          <Text style={styles.memberSinceText}>Member since {new Date(profile.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedProfile.full_name}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, full_name: text })}
              placeholder="Full Name"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.full_name}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedProfile.username}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, username: text })}
              placeholder="Username"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.username}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedProfile.email}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
              placeholder="Email"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.email}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Birth Date</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedProfile.birth_date || ""}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, birth_date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.birth_date || "Not set"}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedProfile.gender || ""}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, gender: text })}
              placeholder="Gender"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.gender || "Not set"}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedProfile.mobile_number || ""}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, mobile_number: text })}
              placeholder="Mobile Number"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.mobile_number || "Not set"}</Text>
          )}
        </View>

        {isEditing && (
          <>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password"
              placeholderTextColor="#888"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </>
        )}

        {isEditing && (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Learning Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Learning Statistics</Text>
        <View style={styles.statsGrid}>
          {/* <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View> */}
          {/* <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View> */}
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>88%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          {/* <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color="#FF5722" />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View> */}
        </View>
      </View>

      {/* Quiz Scores */}
      <View style={styles.scoresContainer}>
        <Text style={styles.sectionTitle}>Recent Quiz Scores</Text>
        {quizScores.map((score, index) => (
          <View key={index} style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreModuleTitle}>{score.modules?.title || "Unknown Module"}</Text>
              <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(score.score) }]}>
                <Text style={styles.scoreValue}>{score.score}%</Text>
              </View>
            </View>
            <Text style={styles.scoreDate}>{new Date(score.created_at).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "#4CAF50"
  if (score >= 80) return "#FF9800"
  if (score >= 70) return "#FFC107"
  return "#F44336"
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
  editButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#1e1e1e",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: "#1e1e1e",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 10,
  },
  memberSince: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberSinceText: {
    fontSize: 14,
    color: "#b0b0b0",
    marginLeft: 5,
  },
  infoContainer: {
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#404040",
  },
  infoLabel: {
    fontSize: 16,
    color: "#b0b0b0",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
    textAlign: "right",
  },
  editInput: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    color: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    paddingVertical: 5,
    outlineStyle: Platform.OS === "web" ? "none" : undefined,
    backgroundColor: "transparent",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    outlineStyle: Platform.OS === "web" ? "none" : undefined,
    backgroundColor: "#3a3a3a",
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  buttonDisabled: {
    backgroundColor: "#666",
    cursor: Platform.OS === "web" ? "not-allowed" : undefined,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
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
  scoresContainer: {
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
  scoreCard: {
    backgroundColor: "#3a3a3a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  scoreModuleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreDate: {
    fontSize: 14,
    color: "#b0b0b0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    margin: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 8,
  },
})
