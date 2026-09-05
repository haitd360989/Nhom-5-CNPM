import { useEffect, useMemo, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
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
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { parentApi } from "../api.js";

export default function ParentOverviewPage() {
  const { accessToken } = useAuth();
  const [overview, setOverview] = useState(null);
  const [progressList, setProgressList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      parentApi.getParentOverview(accessToken),
      parentApi.getStudentProgress(accessToken),
    ])
      .then(([overviewData, progressData]) => {
        if (!active) return;
        setOverview(overviewData);
        setProgressList(progressData);
        setSelectedStudentId(overviewData.students?.[0]?.student_id ?? "");
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [accessToken]);

  const student = useMemo(
    () =>
      overview?.students?.find((item) => item.student_id === selectedStudentId),
    [overview, selectedStudentId],
  );
  const progress = useMemo(
    () => progressList.find((item) => item.student_id === selectedStudentId),
    [progressList, selectedStudentId],
  );
  const recentTests = useMemo(
    () =>
      [...(progress?.daily_scores ?? [])]
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 3),
    [progress],
  );

  if (loading)
    return (
      <Box sx={{ py: 10, display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Đang tải tổng quan phụ huynh" />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Phụ huynh" color="primary" size="small" />
        <Stack direction="row" spacing={1} alignItems="center" mt={1.5}>
          <FamilyRestroomRoundedIcon color="primary" />
          <Typography variant="h4">Tổng quan học tập của con</Typography>
        </Stack>
        <Typography color="text.secondary" mt={0.75}>
          Theo dõi mục tiêu và kết quả học tập mới nhất của học sinh liên kết.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {overview?.students?.length > 1 && (
        <FormControl sx={{ maxWidth: 360 }}>
          <InputLabel id="student-select-label">Học sinh</InputLabel>
          <Select
            labelId="student-select-label"
            value={selectedStudentId}
            label="Học sinh"
            onChange={(event) => setSelectedStudentId(event.target.value)}
          >
            {overview.students.map((item) => (
              <MenuItem key={item.student_id} value={item.student_id}>
                {item.student_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {student && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Học sinh đang theo dõi
          </Typography>
          <Typography variant="h5" fontWeight={750} mt={0.5}>
            {student.student_name}
          </Typography>
        </Paper>
      )}

      {student && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <EmojiEventsRoundedIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Mục tiêu điểm thi (S_target)
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {student.target_score != null
                      ? `${student.target_score}/1200`
                      : "Chưa thiết lập"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AccessTimeRoundedIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Đếm ngược đến kỳ thi
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {student.total_days != null
                      ? `${student.total_days} ngày`
                      : "Chưa có lịch thi"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6">Các bài thi gần nhất</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Tối đa 3 kết quả gần đây của {student?.student_name ?? "học sinh"}
        </Typography>
        {recentTests.length ? (
          <Stack spacing={1.5}>
            {recentTests.map((test, index) => (
              <Paper
                key={`${test.date}-${index}`}
                variant="outlined"
                sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Typography fontWeight={650}>Ngày {test.date}</Typography>
                <Chip
                  label={`${test.score}%`}
                  color="primary"
                  variant="outlined"
                />
              </Paper>
            ))}
          </Stack>
        ) : (
          <Alert severity="info">Học sinh chưa có kết quả bài thi.</Alert>
        )}
      </Paper>
    </Stack>
  );
}
