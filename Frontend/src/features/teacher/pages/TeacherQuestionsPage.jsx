import { useCallback, useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { teacherQuestionApi } from "../api.js";
import QuestionModal from "../components/QuestionModal.jsx";

const LIMIT = 10;

const difficultyLabels = {
  EASY: "Dễ",
  MEDIUM: "Trung bình",
  HARD: "Khó",
};

const difficultyColors = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "error",
};

export default function TeacherQuestionsPage() {
  const { accessToken } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [searchText, setSearchText] = useState("");
  const [skip, setSkip] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchQuestions = useCallback(() => {
    setLoading(true);
    setError("");
    teacherQuestionApi
      .getQuestions(accessToken, { subject, topic, difficulty, skip, limit: LIMIT })
      .then(setQuestions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken, subject, topic, difficulty, skip]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Đổi bộ lọc thì quay về trang đầu (skip = 0)
  const updateFilter = (setter) => (event) => {
    setSkip(0);
    setter(event.target.value);
  };

  // Backend chưa hỗ trợ tìm theo từ khóa nên lọc luôn ở phía frontend
  // trên dữ liệu của trang hiện tại
  const visibleQuestions = questions.filter((question) =>
    question.content.toLowerCase().includes(searchText.toLowerCase()),
  );

  const hasNextPage = questions.length === LIMIT;

  const openAddModal = () => {
    setEditingQuestion(null);
    setModalOpen(true);
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingQuestion) {
        await teacherQuestionApi.updateQuestion(accessToken, editingQuestion.id, payload);
      } else {
        await teacherQuestionApi.createQuestion(accessToken, payload);
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (question) => {
    const confirmed = window.confirm(
      `Xóa câu hỏi "${question.content.slice(0, 40)}..."?`,
    );
    if (!confirmed) return;
    try {
      await teacherQuestionApi.deleteQuestion(accessToken, question.id);
      fetchQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Ngân hàng câu hỏi</Typography>
          <Typography color="text.secondary" mt={1}>
            Quản lý câu hỏi trắc nghiệm: thêm, sửa, xóa và lọc theo môn học.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openAddModal}
        >
          Thêm câu hỏi
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm theo nội dung câu hỏi..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            sx={{ minWidth: 160 }}
            label="Môn học"
            value={subject}
            onChange={updateFilter(setSubject)}
          />
          <TextField
            size="small"
            sx={{ minWidth: 160 }}
            label="Chủ đề"
            value={topic}
            onChange={updateFilter(setTopic)}
          />
          <TextField
            select
            size="small"
            sx={{ minWidth: 160 }}
            label="Độ khó"
            value={difficulty}
            onChange={updateFilter(setDifficulty)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="EASY">Dễ</MenuItem>
            <MenuItem value="MEDIUM">Trung bình</MenuItem>
            <MenuItem value="HARD">Khó</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nội dung</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Độ khó</TableCell>
              <TableCell>Đáp án</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : visibleQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    Không có câu hỏi nào phù hợp
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleQuestions.map((question) => (
                <TableRow key={question.id} hover>
                  <TableCell sx={{ maxWidth: 360 }}>
                    <Typography noWrap title={question.content}>
                      {question.content}
                    </Typography>
                  </TableCell>
                  <TableCell>{question.subject}</TableCell>
                  <TableCell>{question.topic}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={difficultyLabels[question.difficulty] || question.difficulty}
                      color={difficultyColors[question.difficulty] || "default"}
                    />
                  </TableCell>
                  <TableCell>{question.correct_answer}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEditModal(question)}>
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(question)}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center" spacing={2} alignItems="center">
        <Button
          disabled={skip === 0 || loading}
          onClick={() => setSkip((current) => Math.max(0, current - LIMIT))}
        >
          Trang trước
        </Button>
        <Typography color="text.secondary">
          Đang xem từ {skip + 1} - {skip + questions.length}
        </Typography>
        <Button
          disabled={!hasNextPage || loading}
          onClick={() => setSkip((current) => current + LIMIT)}
        >
          Trang sau
        </Button>
      </Stack>

      <QuestionModal
        open={modalOpen}
        question={editingQuestion}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </Stack>
  );
}
