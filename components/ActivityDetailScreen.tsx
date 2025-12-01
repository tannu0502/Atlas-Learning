"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ModuleContent } from "../types";

type Props = {
  route?: any;
  navigation?: any;
  activity?: ModuleContent & { moduleId?: string };
  onBack?: () => void;
  markCompleted?: (contentId?: string) => void;
};

// userAnswers can be number OR number[] depending on the question type
type UserAnswers = { [questionId: string]: number | number[] };

export default function ActivityDetailScreen(props: Props) {
  const route = props.route ?? {};
  const navigation = props.navigation ?? { goBack: () => props.onBack?.() };

  const activity: (ModuleContent & { moduleId?: string }) | undefined =
    route.params?.activity ?? props.activity;

  const onCompleteCallback:
    | ((contentId?: string) => void)
    | undefined =
    route.params?.onComplete ??
    route.params?.markCompleted ??
    props.markCompleted;

  const [userAnswers, setUserAnswers] = React.useState<UserAnswers>({});
  const [quizPassed, setQuizPassed] = React.useState(false);
  const [score, setScore] = React.useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const totalQuestions = activity?.quiz_data?.questions?.length ?? 0;

  // ✅ Load saved state when screen mounts
  React.useEffect(() => {
    const loadQuizState = async () => {
      if (!activity) return;
      try {
        const savedPassed = await AsyncStorage.getItem(`quizPassed_${activity.id}`);
        const savedAnswers = await AsyncStorage.getItem(`quizAnswers_${activity.id}`);
        const savedScore = await AsyncStorage.getItem(`quizScore_${activity.id}`);

        if (savedPassed === "true") {
          setQuizPassed(true);
          if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
          if (savedScore) setScore(Number(savedScore));
        }
      } catch (e) {
        console.error("Error loading quiz state:", e);
      }
    };
    loadQuizState();
  }, [activity]);

  const markAsCompleted = async () => {
    try {
      if (activity) {
        const moduleId = activity.moduleId ?? activity.module_id;
        const progressKey = `progress_${moduleId}`;
        const stored = await AsyncStorage.getItem(progressKey);
        const progress = stored ? JSON.parse(stored) : {};
        progress[activity.id] = true;
        await AsyncStorage.setItem(progressKey, JSON.stringify(progress));
      }
      onCompleteCallback?.(activity?.id);
    } catch (e) {
      console.error("Error saving completion status:", e);
    }
  };

  // Handle selection (supports single & multiple)
  const handleAnswerSelect = (qId: string, optionIndex: number, isMulti: boolean) => {
    setUserAnswers(prev => {
      if (isMulti) {
        const prevSelections = Array.isArray(prev[qId]) ? prev[qId] : [];
        if (prevSelections.includes(optionIndex)) {
          return { ...prev, [qId]: prevSelections.filter(i => i !== optionIndex) };
        } else {
          return { ...prev, [qId]: [...prevSelections, optionIndex] };
        }
      } else {
        return { ...prev, [qId]: optionIndex };
      }
    });
  };

  const handleFinalSubmit = async () => {
    if (!activity) return;
    const allQuestions = activity.quiz_data?.questions || [];
    let correctCount = 0;

    allQuestions.forEach(q => {
      const userAns = userAnswers[q.id];

      if (Array.isArray(q.correct_answer)) {
        const correctSet = new Set(q.correct_answer);
        const userSet = new Set(Array.isArray(userAns) ? userAns : []);
        if (
          Array.isArray(userAns) &&
          q.correct_answer.length === userAns.length &&
          q.correct_answer.every(a => userSet.has(a))
        ) {
          correctCount++;
        }
      } else {
        if (userAns === q.correct_answer) correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / allQuestions.length) * 100);
    setScore(calculatedScore);

    if (correctCount === allQuestions.length) {
      await AsyncStorage.setItem(`quizAnswers_${activity.id}`, JSON.stringify(userAnswers));
      await AsyncStorage.setItem(`quizScore_${activity.id}`, calculatedScore.toString());
      await AsyncStorage.setItem(`quizPassed_${activity.id}`, "true");
      setQuizPassed(true);
      await markAsCompleted();
    }
  };

  if (!activity) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack?.()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>No activity found.</Text>
      </View>
    );
  }

  const currentQuestion = activity.quiz_data?.questions?.[currentQuestionIndex];
  const isMulti = Array.isArray(currentQuestion?.correct_answer);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack?.()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.type}>Type: {activity.type}</Text>

      {currentQuestion && (
        <View style={styles.quizBox}>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              {currentQuestionIndex + 1}. {currentQuestion.question}{" "}
              {isMulti && <Text style={{ color: "#ffa726" }}>(Select all that apply)</Text>}
            </Text>

            <View style={styles.optionsRow}>
              {currentQuestion.options?.map((opt, i) => {
                const userSelection = userAnswers[currentQuestion.id];
                const isSelected = Array.isArray(userSelection)
                  ? userSelection.includes(i)
                  : userSelection === i;

                let showAsCorrect = false;
                let showAsWrong = false;

                if (score !== null && score ===100) {
                  if (Array.isArray(currentQuestion.correct_answer)) {
                    showAsCorrect = currentQuestion.correct_answer.includes(i);
                    showAsWrong = isSelected && !currentQuestion.correct_answer.includes(i);
                  } else {
                    showAsCorrect = i === currentQuestion.correct_answer;
                    showAsWrong = isSelected && i !== currentQuestion.correct_answer;
                  }
                }

                return (
                  <TouchableOpacity
                    key={i}
                    disabled={quizPassed}
                    style={[
                      styles.optionColumn,
                      showAsCorrect && { borderColor: "#4CAF50", borderWidth: 2 },
                      showAsWrong && { borderColor: "#f44336", borderWidth: 2 }
                    ]}
                    onPress={() => {
                      if (!quizPassed && score === null) {
                        handleAnswerSelect(currentQuestion.id, i, isMulti);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.option,
                        showAsCorrect && { color: "#4CAF50" },
                        showAsWrong && { color: "#f44336" }
                      ]}
                    >
                      {isMulti ? (isSelected ? "☑" : "☐") : (isSelected ? "●" : "○")} {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Navigation */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.submitButton, { opacity: currentQuestionIndex === 0 ? 0.5 : 1 }]}
              disabled={currentQuestionIndex === 0}
              onPress={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              <Text style={styles.submitButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, { opacity: currentQuestionIndex === totalQuestions - 1 ? 0.5 : 1 }]}
              disabled={currentQuestionIndex === totalQuestions - 1}
              onPress={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              <Text style={styles.submitButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Final Submit always visible at last question */}
      {!quizPassed &&
        score === null &&
        currentQuestionIndex === totalQuestions - 1 && (
          <TouchableOpacity 
            style={[styles.submitButton, { marginTop: 30 }]}
            onPress={handleFinalSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
      )}

      {/* Show results */}
      {score !== null && (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
          Your Score: {score}%
        </Text>
      )}

      {/* Retry button if failed */}
      {score !== null && score < 100 && currentQuestionIndex === totalQuestions - 1 && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setUserAnswers({});
            setScore(null);
            setCurrentQuestionIndex(0);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}

      {quizPassed && currentQuestionIndex === totalQuestions -1 && (
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              color: "#4CAF50",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            🎉 Congrats!
          </Text>
          <Text
            style={{
              color: "#4CAF50",
              textAlign: "center",
              marginTop: 5,
              fontWeight: "600",
            }}
          >
            You have passed this quiz!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  type: { color: "#aaa", marginBottom: 10 },
  quizBox: { marginTop: 10 },
  questionBox: { marginBottom: 15 },
  questionText: { color: "#fff", fontSize: 16 },
  option: { color: "#ccc", marginLeft: 10 },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionColumn: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center'
  },
  submitButtonText: { color: '#fff', textAlign: 'center' },
  retryButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center'
  },
  retryButtonText: {
    color: '#fff',
    textAlign: 'center'
  }
});
