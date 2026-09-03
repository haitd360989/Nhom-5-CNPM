import { useEffect, useMemo, useState } from "react";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { analyticsApi } from "../api.js";

const SUBJECTS = ["Toán học", "Logic", "Tiếng Việt"];

export default function StudentProgressPage() {
  const { accessToken } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    analyticsApi
      .getProgress(accessToken)
      .then((data) => active && setProgress(data))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [accessToken]);

  const radarData = useMemo(
    () =>
      SUBJECTS.map((subject) => ({
        subject,
        accuracy:
          progress?.subject_accuracy?.find((item) => item.subject === subject)
            ?.accuracy_percent ?? 0,
      })),
    [progress],
  );

  if (loading)
    return (
      <Box sx={{ py: 10, display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Đang tải dữ liệu tiến độ" />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Stack direction="row" spacing={1} alignItems="center" mt={1.5}>
          <AnalyticsRoundedIcon color="primary" />
          <Typography variant="h4">Tiến độ học tập</Typography>
        </Stack>
        <Typography color="text.secondary" mt={0.75}>
          Theo dõi năng lực từng môn và xu hướng điểm qua các lần làm bài.
        </Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}

      {progress && (
        <Grid container spacing={2}>
          {[
            ["Số bài đã hoàn thành", progress.total_tests],
            ["Câu hỏi đã trả lời", progress.total_answered_questions],
            ["Độ chính xác chung", `${progress.overall_accuracy_percent}%`],
            [
              "Điểm dự đoán",
              progress.score_prediction?.s_predict != null
                ? `${progress.score_prediction.s_predict}/1200`
                : "Chưa đủ dữ liệu",
            ],
          ].map(([label, value]) => (
            <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="h5" fontWeight={750} mt={0.5}>
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, height: 430 }}>
            <Typography variant="h6">Năng lực theo môn</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Tỷ lệ trả lời đúng của ba môn
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} tickCount={6} />
                <Radar
                  name="Độ chính xác (%)"
                  dataKey="accuracy"
                  stroke="#3157d5"
                  fill="#3157d5"
                  fillOpacity={0.35}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper variant="outlined" sx={{ p: 3, height: 430 }}>
            <Typography variant="h6">Xu hướng điểm thi</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Điểm phần trăm theo ngày hoàn thành
            </Typography>
            {progress?.daily_scores?.length ? (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart
                  data={progress.daily_scores}
                  margin={{ left: 0, right: 18 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Điểm (%)"
                    stroke="#3157d5"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{ height: "80%", display: "grid", placeItems: "center" }}
              >
                <Alert severity="info">
                  Chưa có bài thi hoàn thành để vẽ biểu đồ.
                </Alert>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
