import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MathMarkdown from "../../../components/common/MathMarkdown.jsx";

export default function AssessmentResult({
  result,
  onRetry,
  title = "Kết quả đánh giá năng lực",
  retryLabel = "Làm lại bài đánh giá",
  primaryLabel = "Xem lộ trình học",
  primaryPath = "/student/roadmap",
  enableTutor = false,
}) {
  const navigate = useNavigate();

  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{ p: { xs: 3, sm: 4 }, overflow: "hidden", position: "relative" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={3}
        >
          <Box>
            <Chip
              icon={<CheckCircleRoundedIcon />}
              label="Đã hoàn thành"
              color="success"
              size="small"
            />
            <Typography variant="h4" mt={1.5}>
              {title}
            </Typography>
            <Typography color="text.secondary" mt={0.75}>
              Xem lại chi tiết để biết phần kiến thức cần cải thiện.
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: "left", sm: "right" }, minWidth: 180 }}>
            <Typography
              variant="h2"
              color="primary"
              fontWeight={800}
              lineHeight={1}
            >
              {result.raw_score}/{result.total_questions}
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Điểm thô · {result.percentage}%
            </Typography>
          </Box>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={result.percentage}
          color={result.percentage >= 50 ? "success" : "warning"}
          sx={{ mt: 3, height: 10, borderRadius: 8 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={3}>
          <Button
            variant="contained"
            startIcon={<RouteRoundedIcon />}
            onClick={() => navigate(primaryPath)}
          >
            {primaryLabel}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReplayRoundedIcon />}
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        </Stack>
      </Paper>

      <Box>
        <Typography variant="h6">Chi tiết câu trả lời</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {result.raw_score} câu đúng ·{" "}
          {result.total_questions - result.raw_score} câu sai hoặc chưa trả lời
        </Typography>
      </Box>

      <Stack spacing={2}>
        {result.question_results.map((item, index) => (
          <Paper
            key={item.question_id}
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderLeft: 4,
              borderLeftColor: item.is_correct ? "success.main" : "error.main",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              gap={2}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  fontWeight: 700,
                  lineHeight: 1.55,
                }}
              >
                <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                  Câu {index + 1}.
                </Box>
                <MathMarkdown inline>{item.content}</MathMarkdown>
              </Box>
              {item.is_correct ? (
                <Chip
                  icon={<CheckCircleRoundedIcon />}
                  label="Đúng"
                  color="success"
                  size="small"
                />
              ) : (
                <Chip
                  icon={<CancelRoundedIcon />}
                  label="Sai"
                  color="error"
                  size="small"
                />
              )}
            </Stack>
            <Divider sx={{ my: 2 }} />
            {item.selected_option ? (
              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  color: item.is_correct ? "success.main" : "error.main",
                }}
              >
                <Box
                  component="span"
                  fontWeight={700}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Bạn chọn:
                </Box>
                <Box component="span" fontWeight={700}>
                  {item.selected_option}.
                </Box>
                <MathMarkdown inline>{item.selected_answer}</MathMarkdown>
              </Box>
            ) : (
              <Alert severity="warning" sx={{ py: 0 }}>
                Bạn chưa trả lời câu này.
              </Alert>
            )}
            {!item.is_correct && (
              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  color: "success.main",
                  mt: 1,
                }}
              >
                <Box
                  component="span"
                  fontWeight={700}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Đáp án đúng:
                </Box>
                <Box component="span" fontWeight={700}>
                  {item.correct_option}.
                </Box>
                <MathMarkdown inline>{item.correct_answer}</MathMarkdown>
              </Box>
            )}
            {item.explanation && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.default",
                }}
              >
                <Box sx={{ display: "flex", gap: 0.75, fontSize: "0.875rem" }}>
                  <Box
                    component="span"
                    fontWeight={700}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Giải thích:
                  </Box>
                  <MathMarkdown inline>{item.explanation}</MathMarkdown>
                </Box>
              </Box>
            )}
            {enableTutor && !item.is_correct && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<SmartToyRoundedIcon />}
                sx={{ mt: 2 }}
                onClick={() =>
                  navigate("/student/tutor", {
                    state: {
                      questionId: item.question_id,
                      initialMessage: `Hãy giải thích câu hỏi này và cách tìm đáp án đúng: ${item.content}`,
                    },
                  })
                }
              >
                Hỏi AI Tutor về câu này
              </Button>
            )}
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
