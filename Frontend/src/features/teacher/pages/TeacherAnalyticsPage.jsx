import { useEffect, useState } from "react";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import { Alert, Box, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { teacherAnalyticsApi } from "../api.js";

function StatCard({ icon, label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4">{value}</Typography>
          <Typography color="text.secondary">{label}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

// Vẽ thanh ngang đơn giản thay biểu đồ cột (dự án chưa cài thư viện chart)
function ScoreBar({ subject, score, maxScore }) {
  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{subject}</Typography>
        <Typography variant="body2" fontWeight={600}>
          {score.toFixed(2)}
        </Typography>
      </Stack>
      <Box sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100", overflow: "hidden" }}>
        <Box
          sx={{
            height: "100%",
            width: `${percent}%`,
            borderRadius: 5,
            bgcolor: "primary.main",
          }}
        />
      </Box>
    </Box>
  );
}

export default function TeacherAnalyticsPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherAnalyticsApi
      .getOverviewAnalytics(accessToken)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight={280}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const scoreEntries = Object.entries(data.average_score_by_subject || {});
  const maxScore = Math.max(...scoreEntries.map(([, score]) => score), 1);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Phân tích học sinh</Typography>
        <Typography color="text.secondary" mt={1}>
          Thống kê tổng quan về học sinh và kết quả học tập.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StatCard
            icon={<PeopleAltRoundedIcon />}
            label="Tổng số học sinh"
            value={data.total_students}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            icon={<AssignmentTurnedInRoundedIcon />}
            label="Tổng số bài đã nộp"
            value={data.total_completed_tests}
          />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Điểm trung bình theo môn học
        </Typography>
        {scoreEntries.length === 0 ? (
          <Typography color="text.secondary">Chưa có dữ liệu điểm số</Typography>
        ) : (
          <Stack spacing={2}>
            {scoreEntries.map(([subject, score]) => (
              <ScoreBar key={subject} subject={subject} score={score} maxScore={maxScore} />
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
