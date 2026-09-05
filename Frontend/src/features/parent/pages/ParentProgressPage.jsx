import { useEffect, useMemo, useState } from "react";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { parentApi } from "../api.js";

const SUBJECTS = ["Toán học", "Logic", "Tiếng Việt"];

export default function ParentProgressPage() {
  const { accessToken } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    parentApi
      .getStudentProgress(accessToken)
      .then((data) => {
        if (!active) return;
        setProgressList(data);
        setSelectedStudentId(data[0]?.student_id ?? "");
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [accessToken]);

  const progress = useMemo(
    () => progressList.find((item) => item.student_id === selectedStudentId),
    [progressList, selectedStudentId],
  );
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
        <CircularProgress aria-label="Đang tải tiến độ học sinh" />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Phụ huynh" color="primary" size="small" />
        <Stack direction="row" spacing={1} alignItems="center" mt={1.5}>
          <AnalyticsRoundedIcon color="primary" />
          <Typography variant="h4">Tiến độ của con</Typography>
        </Stack>
        <Typography color="text.secondary" mt={0.75}>
          Theo dõi năng lực từng môn và xu hướng điểm số của học sinh.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {progressList.length > 1 && (
        <FormControl sx={{ maxWidth: 360 }}>
          <InputLabel id="progress-student-select-label">Học sinh</InputLabel>
          <Select
            labelId="progress-student-select-label"
            value={selectedStudentId}
            label="Học sinh"
            onChange={(event) => setSelectedStudentId(event.target.value)}
          >
            {progressList.map((item) => (
              <MenuItem key={item.student_id} value={item.student_id}>
                {item.student_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {progress && (
        <Alert severity="info">
          Đang xem tiến độ của {progress.student_name}
        </Alert>
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
            <Typography variant="h6">Xu hướng điểm số</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Điểm phần trăm theo ngày hoàn thành
            </Typography>
            {progress?.daily_scores?.length ? (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={progress.daily_scores} margin={{ right: 18 }}>
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
                <Alert severity="info">Chưa có dữ liệu để vẽ biểu đồ.</Alert>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
