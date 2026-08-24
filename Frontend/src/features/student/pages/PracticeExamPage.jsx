import { useCallback, useEffect, useMemo, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MathMarkdown from "../../../components/common/MathMarkdown.jsx";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { practiceApi } from "../api.js";
import AssessmentResult from "../components/AssessmentResult.jsx";

const STORAGE_KEY = "swr-act-practice-config";
const EXAM_SECONDS = 15 * 60;
const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

const readStoredConfig = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export default function PracticeExamPage() {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const config = useMemo(
    () => location.state?.config || readStoredConfig(),
    [location.state],
  );
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const loadQuestions = useCallback(async () => {
    if (!config?.subject || !config?.difficulty) {
      setError("Chưa có cấu hình bài luyện tập.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await practiceApi.getQuestions(accessToken, config);
      setQuestions(data);
      setAnswers({});
      setCurrent(0);
      setSecondsLeft(EXAM_SECONDS);
      setResult(null);
      if (!data.length)
        setError("Không có câu hỏi phù hợp với bộ lọc đã chọn.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, config]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const submitExam = useCallback(async () => {
    if (!questions.length || submitting || result) return;
    setConfirmOpen(false);
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        answers: questions.map((question) => ({
          question_id: question.id,
          selected_option: answers[question.id] || "",
        })),
      };
      setResult(await practiceApi.submit(accessToken, payload));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }, [accessToken, answers, questions, result, submitting]);

  useEffect(() => {
    if (loading || !questions.length || result) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          window.setTimeout(submitExam, 0);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [loading, questions.length, result, submitExam]);

  const answeredCount = Object.keys(answers).length;
  const question = questions[current];
  const choices = useMemo(
    () => Object.entries(question?.choices || {}),
    [question],
  );

  if (loading)
    return (
      <Paper sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Paper>
    );

  if (result)
    return (
      <AssessmentResult
        result={result}
        title="Kết quả luyện tập"
        retryLabel="Luyện lại bộ câu hỏi"
        primaryLabel="Chọn bài luyện tập khác"
        primaryPath="/student/practice"
        enableTutor
        onRetry={loadQuestions}
      />
    );

  if (!questions.length)
    return (
      <Alert
        severity="warning"
        action={
          <Button onClick={() => navigate("/student/practice")}>
            Chọn lại
          </Button>
        }
      >
        {error || "Không có câu hỏi phù hợp."}
      </Alert>
    );

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <FitnessCenterRoundedIcon color="primary" />
              <Typography variant="h6">
                Bài luyện tập {config.subject}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip label={config.topic || "Tất cả chuyên đề"} size="small" />
              <Chip
                label={config.difficulty}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          </Box>
          <Chip
            icon={<AccessTimeRoundedIcon />}
            label={formatTime(secondsLeft)}
            color={secondsLeft <= 60 ? "error" : "primary"}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" mt={2} mb={1}>
          <Typography variant="body2" fontWeight={700}>
            Tiến trình
          </Typography>
          <Typography variant="body2">
            {answeredCount}/{questions.length} câu
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(answeredCount / questions.length) * 100}
        />
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 230px" },
          gap: 2.5,
        }}
      >
        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack direction="row" spacing={1} mb={2}>
            <Chip label={`Câu ${current + 1}`} color="primary" size="small" />
            {question.topic && (
              <Chip label={question.topic} size="small" variant="outlined" />
            )}
          </Stack>
          <MathMarkdown sx={{ fontSize: "1.15rem", fontWeight: 650 }}>
            {question.content}
          </MathMarkdown>
          <Stack spacing={1.5} mt={3}>
            {choices.map(([key, text]) => {
              const selected = answers[question.id] === key;
              return (
                <Paper
                  component="button"
                  type="button"
                  key={key}
                  variant="outlined"
                  onClick={() =>
                    setAnswers((value) => ({ ...value, [question.id]: key }))
                  }
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    cursor: "pointer",
                    borderColor: selected ? "primary.main" : "divider",
                    bgcolor: selected ? "action.selected" : "background.paper",
                    color: "text.primary",
                    font: "inherit",
                  }}
                >
                  <Radio checked={selected} tabIndex={-1} />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <b>{key}.</b>
                    <MathMarkdown inline>{text}</MathMarkdown>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              disabled={!current}
              onClick={() => setCurrent((value) => value - 1)}
            >
              Câu trước
            </Button>
            {current < questions.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => setCurrent((value) => value + 1)}
              >
                Câu tiếp theo
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => setConfirmOpen(true)}
              >
                Nộp bài
              </Button>
            )}
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2.5, alignSelf: "start" }}>
          <Typography fontWeight={700} mb={2}>
            Danh sách câu hỏi
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {questions.map((item, index) => (
              <Button
                key={item.id}
                size="small"
                variant={
                  current === index || answers[item.id]
                    ? "contained"
                    : "outlined"
                }
                color={
                  current === index
                    ? "primary"
                    : answers[item.id]
                      ? "success"
                      : "inherit"
                }
                onClick={() => setCurrent(index)}
                sx={{ minWidth: 0, aspectRatio: "1" }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
          <Button
            fullWidth
            variant="outlined"
            color="success"
            sx={{ mt: 2.5 }}
            onClick={() => setConfirmOpen(true)}
          >
            Nộp bài
          </Button>
        </Paper>
      </Box>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận nộp bài?</DialogTitle>
        <DialogContent>
          Bạn đã hoàn thành {answeredCount}/{questions.length} câu.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Tiếp tục làm</Button>
          <Button
            variant="contained"
            color="success"
            disabled={submitting}
            onClick={submitExam}
          >
            {submitting ? "Đang nộp…" : "Nộp bài"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
