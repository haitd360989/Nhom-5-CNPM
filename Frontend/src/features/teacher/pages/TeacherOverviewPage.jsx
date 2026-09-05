import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import HelpCenterRoundedIcon from "@mui/icons-material/HelpCenterRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { teacherOverviewApi } from "../api.js";

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

export default function TeacherOverviewPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherOverviewApi
      .getTeacherOverview(accessToken)
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

  const subjectEntries = Object.entries(data.questions_by_subject || {});

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Tổng quan giáo viên</Typography>
        <Typography color="text.secondary" mt={1}>
          Thống kê nhanh về ngân hàng câu hỏi và học sinh.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<QuizRoundedIcon />}
            label="Tổng số câu hỏi"
            value={data.total_questions}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<PeopleAltRoundedIcon />}
            label="Tổng số học sinh"
            value={data.total_students}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<AssignmentTurnedInRoundedIcon />}
            label="Tổng lượt làm bài"
            value={data.total_test_attempts}
          />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Số câu hỏi theo môn học
        </Typography>
        {subjectEntries.length === 0 ? (
          <Typography color="text.secondary">Chưa có câu hỏi nào</Typography>
        ) : (
          <Stack spacing={1}>
            {subjectEntries.map(([subject, count]) => (
              <Stack key={subject} direction="row" justifyContent="space-between">
                <Typography>{subject}</Typography>
                <Typography fontWeight={600}>{count}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Truy cập nhanh
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<HelpCenterRoundedIcon />}
            component={RouterLink}
            to="/teacher/questions"
          >
            Ngân hàng câu hỏi
          </Button>
          <Button
            variant="outlined"
            startIcon={<AnalyticsRoundedIcon />}
            component={RouterLink}
            to="/teacher/analytics"
          >
            Phân tích học sinh
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
