import { useEffect, useState } from "react";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import MathMarkdown from "../../../components/common/MathMarkdown.jsx";

const emptyValues = {
  content: "",
  choiceA: "",
  choiceB: "",
  choiceC: "",
  choiceD: "",
  correct_answer: "A",
  subject: "",
  topic: "",
  difficulty: "MEDIUM",
  explanation: "",
};

const difficultyOptions = [
  ["EASY", "Dễ"],
  ["MEDIUM", "Trung bình"],
  ["HARD", "Khó"],
];

// Câu hỏi từ server trả choices dạng { A: "...", B: "...", ... }
// Modal tách ra 4 ô riêng cho dễ nhập, lúc lưu mới gộp lại thành JSON.
function toFormValues(question) {
  if (!question) return emptyValues;
  const choices = question.choices || {};
  return {
    content: question.content || "",
    choiceA: choices.A || "",
    choiceB: choices.B || "",
    choiceC: choices.C || "",
    choiceD: choices.D || "",
    correct_answer: question.correct_answer || "A",
    subject: question.subject || "",
    topic: question.topic || "",
    difficulty: question.difficulty || "MEDIUM",
    explanation: question.explanation || "",
  };
}

function validate(values) {
  const errors = {};
  if (!values.content.trim()) errors.content = "Vui lòng nhập nội dung câu hỏi";
  if (!values.choiceA.trim()) errors.choiceA = "Bắt buộc";
  if (!values.choiceB.trim()) errors.choiceB = "Bắt buộc";
  if (!values.choiceC.trim()) errors.choiceC = "Bắt buộc";
  if (!values.choiceD.trim()) errors.choiceD = "Bắt buộc";
  if (!values.subject.trim()) errors.subject = "Vui lòng nhập môn học";
  if (!values.topic.trim()) errors.topic = "Vui lòng nhập chủ đề";
  return errors;
}

export default function QuestionModal({
  open,
  question,
  onClose,
  onSave,
  saving = false,
}) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(question));
      setErrors({});
      setPreview(false);
    }
  }, [open, question]);

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSave({
      content: values.content,
      choices: {
        A: values.choiceA,
        B: values.choiceB,
        C: values.choiceC,
        D: values.choiceD,
      },
      correct_answer: values.correct_answer,
      subject: values.subject,
      topic: values.topic,
      difficulty: values.difficulty,
      explanation: values.explanation || null,
    });
  };

  const choiceFields = [
    ["choiceA", "Đáp án A"],
    ["choiceB", "Đáp án B"],
    ["choiceC", "Đáp án C"],
    ["choiceD", "Đáp án D"],
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={submit} noValidate>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                p: 1,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <QuizRoundedIcon />
            </Box>
            <Typography variant="h6">
              {question ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
            </Typography>
            <Box flexGrow={1} />
            <ToggleButton
              size="small"
              value="preview"
              selected={preview}
              onChange={() => setPreview((current) => !current)}
            >
              <VisibilityRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
              Xem trước
            </ToggleButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {preview ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Alert severity="info">
                Xem trước công thức toán (LaTeX) hiển thị đúng như học sinh sẽ thấy.
              </Alert>
              <Typography variant="subtitle2">Nội dung câu hỏi</Typography>
              <MathMarkdown>{values.content || "_(chưa có nội dung)_"}</MathMarkdown>
              {choiceFields.map(([field, label]) => (
                <Box key={field}>
                  <Typography variant="subtitle2">{label}</Typography>
                  <MathMarkdown>{values[field] || "_(trống)_"}</MathMarkdown>
                </Box>
              ))}
            </Stack>
          ) : (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                required
                fullWidth
                multiline
                minRows={2}
                label="Nội dung câu hỏi"
                helperText={
                  errors.content ||
                  "Hỗ trợ công thức LaTeX, ví dụ: $x^2 + 1 = 0$"
                }
                error={Boolean(errors.content)}
                value={values.content}
                onChange={update("content")}
              />
              <Grid container spacing={2}>
                {choiceFields.map(([field, label]) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      required
                      fullWidth
                      label={label}
                      error={Boolean(errors[field])}
                      helperText={errors[field]}
                      value={values[field]}
                      onChange={update(field)}
                    />
                  </Grid>
                ))}
              </Grid>
              <TextField
                select
                required
                fullWidth
                label="Đáp án đúng"
                value={values.correct_answer}
                onChange={update("correct_answer")}
              >
                {["A", "B", "C", "D"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Môn học"
                    placeholder="Toán học, Logic..."
                    error={Boolean(errors.subject)}
                    helperText={errors.subject}
                    value={values.subject}
                    onChange={update("subject")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Chủ đề"
                    error={Boolean(errors.topic)}
                    helperText={errors.topic}
                    value={values.topic}
                    onChange={update("topic")}
                  />
                </Grid>
              </Grid>
              <TextField
                select
                required
                fullWidth
                label="Độ khó"
                value={values.difficulty}
                onChange={update("difficulty")}
              >
                {difficultyOptions.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Lời giải (không bắt buộc)"
                value={values.explanation}
                onChange={update("explanation")}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu câu hỏi"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
