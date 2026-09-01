import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CartesianGrid,
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
  const theme = useTheme();
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
        score:
          progress?.subject_accuracy?.find((item) => item.subject === subject)
            ?.accuracy_percent ?? 0,
      })),
    [progress],
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Đang tải tiến độ" />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Typography variant="h4" mt={1.5}>
          Tiến độ học tập
        </Typography>
        <Typography color="text.secondary" mt={0.75}>
          Tổng hợp năng lực theo môn và xu hướng điểm thi của bạn.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {progress && (
        <>
          <Grid container spacing={2}>
            {[
              ["Bài thi đã làm", progress.total_tests],
              ["Câu hỏi đã trả lời", progress.total_answered_questions],
              ["Độ chính xác", `${progress.overall_accuracy_percent}%`],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5}>
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Typography variant="h6">Năng lực 3 môn</Typography>
                <Box sx={{ width: "100%", height: 340, mt: 1 }}>
                  <ResponsiveContainer>
                    <RadarChart data={radarData} outerRadius="72%">
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} tickCount={6} />
                      <Radar
                        name="Độ chính xác"
                        dataKey="score"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.3}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Độ chính xác"]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Typography variant="h6">Xu hướng điểm thi</Typography>
                <Box sx={{ width: "100%", height: 340, mt: 1 }}>
                  {progress.daily_scores.length ? (
                    <ResponsiveContainer>
                      <LineChart
                        data={progress.daily_scores}
                        margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, "auto"]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          name="Điểm thi"
                          stroke={theme.palette.primary.main}
                          strokeWidth={3}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Typography color="text.secondary">
                        Chưa có điểm thi để hiển thị xu hướng.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
}
