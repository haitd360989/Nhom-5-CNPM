import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { teacherOverviewApi } from "../api.js";

export default function TeacherKnowledgePage() {
  const { accessToken } = useAuth();
  const [documentText, setDocumentText] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await teacherOverviewApi.queryKnowledge(accessToken, {
        document_text: documentText,
        user_query: userQuery,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Kho tri thức</Typography>
        <Typography color="text.secondary" mt={1}>
          Nhập tài liệu ôn tập và câu hỏi để kiểm tra các đoạn văn bản liên quan nhất.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tài liệu ôn tập / lý thuyết mẫu"
              multiline
              minRows={5}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              required
            />
            <TextField
              label="Câu hỏi cần tra cứu"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              required
            />
            <Box>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Stack alignItems="center" justifyContent="center" minHeight={120}>
          <CircularProgress />
        </Stack>
      )}

      {result && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Top {result.top_k_results.length} đoạn liên quan nhất
            (tổng {result.total_chunks_created} đoạn)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nội dung đoạn</TableCell>
                  <TableCell align="right">Điểm Cosine</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.top_k_results.map((chunk) => (
                  <TableRow key={chunk.chunk_id}>
                    <TableCell>{chunk.chunk_id}</TableCell>
                    <TableCell>{chunk.content}</TableCell>
                    <TableCell align="right">
                      {chunk.similarity_score.toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Stack>
  );
}
