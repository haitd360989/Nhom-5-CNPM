import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MathMarkdown from "../../../components/common/MathMarkdown.jsx";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { tutorApi } from "../api.js";

// Câu hỏi gợi ý nhanh, bấm vào sẽ tự điền và gửi luôn
const QUICK_QUESTIONS = [
  "Giải thích cách giải phương trình bậc hai",
  "Cho ví dụ về suy luận logic dạng dãy số",
  "Cách xác định luận điểm chính trong đoạn văn",
  "Công thức tính đạo hàm cơ bản",
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "ai",
  content:
    "Chào bạn, mình là **AI Tutor**. Bạn có thể hỏi mình bất cứ câu nào liên quan tới Toán, Tư duy Logic hoặc Tiếng Việt trong đề thi ĐGNL nhé.",
};

export default function TutorChatPage() {
  const { accessToken } = useAuth();
  const location = useLocation();
  const questionId = location.state?.questionId;
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState(location.state?.initialMessage || "");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waiting]);

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || waiting) return;

    if (!questionId) {
      setError(
        "Hãy mở AI Tutor từ nút 'Hỏi AI Tutor' tại một câu làm sai để hệ thống có ngữ cảnh câu hỏi.",
      );
      return;
    }

    setError("");
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", content },
    ]);
    setInput("");
    setWaiting(true);

    try {
      const response = await tutorApi.ask(accessToken, {
        question_id: questionId,
        user_message: content,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: "ai",
          content: response.answer,
        },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWaiting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <Stack spacing={2.5} sx={{ height: "100%" }}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Stack direction="row" spacing={1} alignItems="center" mt={1.5}>
          <SmartToyRoundedIcon color="primary" />
          <Typography variant="h6">AI Tutor</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Hỏi đáp trực tiếp cùng AI để làm rõ các kiến thức còn chưa nắm chắc.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { xs: 500, sm: 600 },
          overflow: "hidden",
        }}
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ m: 2, mb: 0 }}
          >
            {error}
          </Alert>
        )}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <Stack
                  key={message.id}
                  direction="row"
                  spacing={1.5}
                  justifyContent={isUser ? "flex-end" : "flex-start"}
                  alignItems="flex-start"
                >
                  {!isUser && (
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      <SmartToyRoundedIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper
                    variant={isUser ? "elevation" : "outlined"}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: "78%",
                      borderRadius: 2.5,
                      bgcolor: isUser ? "primary.main" : "background.default",
                      color: isUser ? "primary.contrastText" : "text.primary",
                    }}
                  >
                    <MathMarkdown sx={{ fontSize: "0.95rem" }}>
                      {message.content}
                    </MathMarkdown>
                  </Paper>
                  {isUser && (
                    <Avatar
                      sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}
                    >
                      <PersonRoundedIcon fontSize="small" />
                    </Avatar>
                  )}
                </Stack>
              );
            })}

            {waiting && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  <SmartToyRoundedIcon fontSize="small" />
                </Avatar>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: "background.default",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={14} />
                    <Typography variant="body2" color="text.secondary">
                      AI Tutor đang trả lời…
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            )}
            <div ref={bottomRef} />
          </Stack>
        </Box>

        <Box
          sx={{ borderTop: 1, borderColor: "divider", p: { xs: 1.5, sm: 2 } }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              pb: 1.25,
              "&::-webkit-scrollbar": { height: 4 },
            }}
          >
            {QUICK_QUESTIONS.map((question) => (
              <Chip
                key={question}
                label={question}
                size="small"
                variant="outlined"
                clickable
                onClick={() => sendMessage(question)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập câu hỏi của bạn…"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={waiting}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={waiting || !input.trim()}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                  "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
                }}
              >
                <SendRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Stack>
  );
}
