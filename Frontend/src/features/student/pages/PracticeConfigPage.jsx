import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "swr-act-practice-config";

const SUBJECTS = [
  {
    value: "Toán học",
    label: "Toán",
    description: "Đại số, giải tích và xác suất",
    icon: CalculateRoundedIcon,
    topics: [
      "Hàm số",
      "Tích phân",
      "Dãy số",
      "Tổ hợp",
      "Xác suất",
      "Hình không gian",
      "Mũ - Logarit",
    ],
  },
  {
    value: "Logic",
    label: "Logic",
    description: "Quy luật và tư duy suy luận",
    icon: PsychologyRoundedIcon,
    topics: [
      "Mệnh đề",
      "Quy luật số",
      "Suy luận thứ tự",
      "Thời gian",
      "Chuỗi chữ cái",
      "Quy tắc suy diễn",
      "Tổ hợp logic",
    ],
  },
  {
    value: "Tiếng Việt",
    label: "Tiếng Việt",
    description: "Ngôn ngữ và đọc hiểu văn bản",
    icon: TranslateRoundedIcon,
    topics: [
      "Chính tả",
      "Thành ngữ",
      "Văn học",
      "Ngữ pháp",
      "Biện pháp tu từ",
      "Từ vựng",
    ],
  },
];

const DIFFICULTIES = [
  { value: "EASY", label: "Dễ", description: "Củng cố kiến thức nền tảng" },
  {
    value: "MEDIUM",
    label: "Trung bình",
    description: "Luyện tập ở mức tiêu chuẩn",
  },
  { value: "HARD", label: "Khó", description: "Thử thách khả năng vận dụng" },
];

export default function PracticeConfigPage() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState(SUBJECTS[0].value);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");

  const selectedSubject = useMemo(
    () => SUBJECTS.find((item) => item.value === subject),
    [subject],
  );

  const selectSubject = (nextSubject) => {
    setSubject(nextSubject);
    setTopic("");
  };

  const submit = (event) => {
    event.preventDefault();
    const config = { subject, topic, difficulty, limit: 10 };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    navigate("/student/practice/exam", { state: { config } });
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Typography variant="h4" mt={1.5}>
          Cấu hình bài luyện tập
        </Typography>
        <Typography color="text.secondary" mt={0.75}>
          Chọn nội dung phù hợp để hệ thống chuẩn bị bộ câu hỏi cho bạn.
        </Typography>
      </Box>

      <Box component="form" onSubmit={submit}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h6">1. Chọn môn thi</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
              mb={2.5}
            >
              Mỗi bài luyện tập tập trung vào một môn.
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {SUBJECTS.map(({ value, label, description, icon: Icon }) => {
                const selected = value === subject;
                return (
                  <Paper
                    component="button"
                    type="button"
                    key={value}
                    variant="outlined"
                    onClick={() => selectSubject(value)}
                    aria-pressed={selected}
                    sx={{
                      p: 2.5,
                      textAlign: "left",
                      cursor: "pointer",
                      color: "text.primary",
                      font: "inherit",
                      borderWidth: 2,
                      borderColor: selected ? "primary.main" : "divider",
                      bgcolor: selected
                        ? "rgba(49, 87, 213, 0.06)"
                        : "background.paper",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          bgcolor: selected ? "primary.main" : "action.hover",
                          color: selected
                            ? "primary.contrastText"
                            : "text.secondary",
                        }}
                      >
                        <Icon />
                      </Box>
                      <Box>
                        <Typography fontWeight={750}>{label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h6">2. Chọn chuyên đề</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5} mb={2}>
              Có thể chọn tất cả chuyên đề của môn hoặc tập trung vào một nội
              dung.
            </Typography>
            <FormControl fullWidth>
              <Select
                value={topic}
                onChange={(event) => {
                  setTopic(event.target.value);
                }}
                displayEmpty
                inputProps={{ "aria-label": "Chuyên đề luyện tập" }}
              >
                <MenuItem value="">Tất cả chuyên đề</MenuItem>
                {selectedSubject.topics.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <FormControl fullWidth>
              <FormLabel sx={{ color: "text.primary" }}>
                <Typography variant="h6">3. Chọn mức độ khó</Typography>
              </FormLabel>
              <RadioGroup
                value={difficulty}
                onChange={(event) => {
                  setDifficulty(event.target.value);
                }}
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 1.5,
                }}
              >
                {DIFFICULTIES.map((item) => {
                  const selected = difficulty === item.value;
                  return (
                    <Paper
                      key={item.value}
                      variant="outlined"
                      sx={{
                        borderColor: selected ? "primary.main" : "divider",
                        bgcolor: selected
                          ? "rgba(49, 87, 213, 0.06)"
                          : "background.paper",
                      }}
                    >
                      <FormControlLabel
                        value={item.value}
                        control={<Radio />}
                        sx={{
                          m: 0,
                          p: 1.5,
                          width: "100%",
                          alignItems: "flex-start",
                        }}
                        label={
                          <Box pt={0.25}>
                            <Typography fontWeight={700}>
                              {item.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Paper>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="flex-end"
            gap={1.5}
          >
            <Button
              type="button"
              color="inherit"
              onClick={() => {
                setSubject(SUBJECTS[0].value);
                setTopic("");
                setDifficulty("MEDIUM");
              }}
            >
              Đặt lại
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Tiếp tục
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
