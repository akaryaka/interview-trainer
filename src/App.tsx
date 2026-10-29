import { useState, useMemo, useCallback } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { questions } from "./questions.ts";
import "./App.css";

function App() {
  function QuestionCard({ question, showAnswer, onToggleAnswer }) {
    const difficultyColors = {
      easy: "#4caf50",
      medium: "#ff9800",
      hard: "#f44336",
    };

    const difficultyLabels = {
      easy: "Легкий",
      medium: "Средний",
      hard: "Сложный",
    };

    return (
      <div
        style={{
          border: "2px solid #e0e0e0",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "16px",
              backgroundColor: difficultyColors[question.difficulty],
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
              marginRight: "8px",
            }}
          >
            {difficultyLabels[question.difficulty]}
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "16px",
              backgroundColor: "#2196f3",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {question.category === "theory" ? "Теория" : "Практика"}
          </span>
        </div>

        <h2 style={{ margin: "0 0 16px 0", fontSize: "20px" }}>
          {question.question}
        </h2>

        {!showAnswer && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <strong>💡 Подсказка:</strong> {question.hint}
          </div>
        )}

        <button
          onClick={onToggleAnswer}
          style={{
            padding: "10px 20px",
            backgroundColor: showAnswer ? "#f44336" : "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {showAnswer ? "Скрыть ответ" : "Показать ответ"}
        </button>

        {showAnswer && (
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              borderLeft: "4px solid #2196f3",
            }}
          >
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              {question.answer}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // Главный компонент приложения
  // export default function InterviewTrainer() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filter, setFilter] = useState("all");

  // Фильтрация вопросов
  const filteredQuestions = useMemo(() => {
    if (filter === "all") return questions;
    return questions.filter((q) => q.category === filter);
  }, [filter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Навигация
  const handleNext = useCallback(() => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) =>
      prev < filteredQuestions.length - 1 ? prev + 1 : 0,
    );
  }, [filteredQuestions.length]);

  const handlePrev = useCallback(() => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) =>
      prev > 0 ? prev - 1 : filteredQuestions.length - 1,
    );
  }, [filteredQuestions.length]);

  const handleToggleAnswer = useCallback(() => {
    setShowAnswer((prev) => !prev);
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
  }, []);

  if (!currentQuestion) return null;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px" }}>
          🎯 React Interview Trainer
        </h1>
        <p style={{ margin: 0, color: "#666" }}>
          Тренажер для подготовки к собеседованиям
        </p>
      </header>

      {/* Фильтры */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          justifyContent: "center",
        }}
      >
        {["all", "theory", "practice"].map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            style={{
              padding: "8px 16px",
              backgroundColor: filter === f ? "#2196f3" : "#e0e0e0",
              color: filter === f ? "#fff" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: filter === f ? "bold" : "normal",
            }}
          >
            {f === "all" ? "Все" : f === "theory" ? "Теория" : "Практика"}
          </button>
        ))}
      </div>

      {/* Прогресс */}
      <div
        style={{
          marginBottom: "24px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Вопрос {currentQuestionIndex + 1} из {filteredQuestions.length}
      </div>

      {/* Карточка вопроса */}
      <QuestionCard
        question={currentQuestion}
        showAnswer={showAnswer}
        onToggleAnswer={handleToggleAnswer}
      />

      {/* Навигация */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          marginTop: "24px",
        }}
      >
        <button
          onClick={handlePrev}
          style={{
            padding: "12px 24px",
            backgroundColor: "#9e9e9e",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          ← Предыдущий
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Следующий →
        </button>
      </div>
    </div>
  );
  // }
}

export default App;
