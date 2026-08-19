import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
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
import { useAuth } from "../../auth/context/AuthContext.jsx";
import MathMarkdown from "../../../components/common/MathMarkdown.jsx";
import { diagnosticApi } from "../api.js";
import AssessmentResult from "../components/AssessmentResult.jsx";

const EXAM_SECONDS = 15 * 60;

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function DiagnosticAssessmentPage() {
  const { accessToken } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const startedAt = useRef(Date.now());

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await diagnosticApi.getQuestions(accessToken);
      setQuestions(data);
      setAnswers({});
      setCurrent(0);
      setSecondsLeft(EXAM_SECONDS);
      startedAt.current = Date.now();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const submitExam = useCallback(async () => {
    if (!questions.length || submitting || result) return;
    setConfirmOpen(false);
    setSubmitting(true);
    setError("");
    try {
      const completionTime = Math.max(
        1,
        Math.round((Date.now() - startedAt.current) / 1000),
      );
      const payload = {
        completion_time_seconds: completionTime,
        answers: questions.map((question) => ({
          question_id: question.id,
          selected_option: answers[question.id] || "",
        })),
      };
      setResult(await diagnosticApi.submit(accessToken, payload));
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
  const completion = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;
  const question = questions[current];
  const choices = useMemo(
    () => Object.entries(question?.choices || {}),
    [question],
  );

  if (loading)
    return (
      <Paper sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">Đang tải bộ câu hỏi…</Typography>
        </Stack>
      </Paper>
    );

  if (error && !questions.length)
    return (
      <Alert
        severity="error"
        action={<Button onClick={loadQuestions}>Thử lại</Button>}
      >
        {error}
      </Alert>
    );

  if (result)
    return (
      <AssessmentResult
        result={result}
        onRetry={() => {
          setResult(null);
          loadQuestions();
        }}
      />
    );

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <FactCheckRoundedIcon color="primary" />
              <Typography variant="h6">Bài đánh giá năng lực</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Chọn một đáp án đúng nhất cho mỗi câu hỏi.
            </Typography>
          </Box>
          <Chip
            icon={<AccessTimeRoundedIcon />}
            label={formatTime(secondsLeft)}
            color={secondsLeft <= 60 ? "error" : "primary"}
            variant={secondsLeft <= 60 ? "filled" : "outlined"}
            sx={{
              fontSize: 17,
              fontWeight: 750,
              px: 1,
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" mt={2.5} mb={1}>
          <Typography variant="body2" fontWeight={650}>
            Tiến trình làm bài
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {answeredCount}/{questions.length} câu
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={completion}
          sx={{ height: 8, borderRadius: 8 }}
        />
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

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
            {question.difficulty && (
              <Chip
                label={question.difficulty}
                size="small"
                variant="outlined"
              />
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
                  onClick={() =>
                    setAnswers((value) => ({ ...value, [question.id]: key }))
                  }
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    cursor: "pointer",
                    borderColor: selected ? "primary.main" : "divider",
                    bgcolor: selected ? "primary.50" : "background.paper",
                    color: "text.primary",
                    font: "inherit",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Radio checked={selected} tabIndex={-1} />
                  <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                    <Box component="span" fontWeight={750}>
                      {key}.
                    </Box>
                    <MathMarkdown inline>{text}</MathMarkdown>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              disabled={current === 0}
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
            disabled={submitting}
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
          <Typography>
            Bạn đã hoàn thành {answeredCount}/{questions.length} câu.
          </Typography>
          {answeredCount < questions.length && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Bạn còn {questions.length - answeredCount} câu chưa trả lời.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmOpen(false)}>Tiếp tục làm</Button>
          <Button
            variant="contained"
            color="success"
            onClick={submitExam}
            disabled={submitting}
          >
            {submitting ? "Đang nộp…" : "Nộp bài"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
