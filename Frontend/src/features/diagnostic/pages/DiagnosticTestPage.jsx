import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { diagnosticApi } from "../api.js";

// key luu tam bai lam vao localStorage, tranh mat du lieu neu hoc sinh lo F5
const PROGRESS_KEY = "diagnostic_progress";

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY));
  } catch {
    return null;
  }
}

export default function DiagnosticTestPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: "A" | "B" | ... }
  const startedAtRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);

  // Subtask 4.3: khoi phuc trang thai da luu tam (neu co)
  useEffect(() => {
    const saved = readProgress();
    if (saved?.answers) setAnswers(saved.answers);
    startedAtRef.current = saved?.startedAt || Date.now();
    if (!saved?.startedAt) {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ answers: {}, startedAt: startedAtRef.current }),
      );
    }
  }, []);

  // Subtask 4.1: lay danh sach cau hoi chan doan
  useEffect(() => {
    if (!accessToken) return;
    diagnosticApi
      .getQuestions(accessToken)
      .then(setQuestions)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoadingQuestions(false));
  }, [accessToken]);

  // Subtask 4.3: moi lan chon dap an -> luu tam vao localStorage
  const selectAnswer = (questionId, option) => {
    const next = { ...answers, [questionId]: option };
    setAnswers(next);
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ answers: next, startedAt: startedAtRef.current }),
    );
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  // Subtask 4.4: ghep noi API nop bai POST /api/diagnostic/submit
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const completion_time_seconds = Math.max(
        1,
        Math.floor((Date.now() - startedAtRef.current) / 1000),
      );
      const payload = {
        completion_time_seconds,
        answers: Object.entries(answers).map(
          ([question_id, selected_option]) => ({
            question_id: Number(question_id),
            selected_option,
          }),
        ),
      };
      const response = await diagnosticApi.submit(accessToken, payload);
      setResult(response);
      localStorage.removeItem(PROGRESS_KEY);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuestions) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  if (loadError) {
    return <Alert severity="error">{loadError}</Alert>;
  }

  if (result) {
    return (
      <Paper sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Đã nộp bài thành công!
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {result.message}
        </Typography>
        <Typography variant="h2" color="primary" fontWeight={700}>
          {result.percentage}%
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Đúng {result.raw_score}/{result.total_questions} câu
        </Typography>
        <Button variant="contained" onClick={() => navigate("/student")}>
          Về trang tổng quan
        </Button>
      </Paper>
    );
  }

  if (!questions.length) {
    return <Alert severity="info">Chưa có câu hỏi chẩn đoán nào.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Đánh giá năng lực</Typography>
        <Typography color="text.secondary" mt={1}>
          Trả lời {questions.length} câu hỏi để hệ thống chẩn đoán năng lực
          hiện tại.
        </Typography>
      </Box>

      <Box>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="body2">
            Câu {currentIndex + 1}/{questions.length}
          </Typography>
          <Typography variant="body2">
            Đã trả lời: {answeredCount}/{questions.length}
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progressPercent} />
      </Box>

      <Paper sx={{ p: 4 }}>
        <Stack spacing={1} mb={2} direction="row" flexWrap="wrap">
          <Chip size="small" label={currentQuestion.subject} />
          {currentQuestion.topic && (
            <Chip size="small" label={currentQuestion.topic} variant="outlined" />
          )}
        </Stack>
        <Typography variant="h6" mb={3}>
          {currentQuestion.content}
        </Typography>
        <FormControl>
          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
          >
            {Object.entries(currentQuestion.choices).map(([key, text]) => (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio />}
                label={`${key}. ${text}`}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      {submitError && <Alert severity="error">{submitError}</Alert>}

      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Câu trước
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Câu tiếp theo
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            disabled={submitting || answeredCount === 0}
            onClick={handleSubmit}
          >
            {submitting ? "Đang nộp bài..." : "Nộp bài"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
