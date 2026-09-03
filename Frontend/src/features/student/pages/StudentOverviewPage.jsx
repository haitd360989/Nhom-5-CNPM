import { useEffect, useMemo, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { practiceApi, studyPlanApi } from "../api.js";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(value))
    : "—";

export default function StudentOverviewPage() {
  const { accessToken, user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      studyPlanApi.getCurrent(accessToken),
      practiceApi.history(accessToken),
    ]).then(([planResult, historyResult]) => {
      if (!active) return;
      if (planResult.status === "fulfilled") setPlan(planResult.value);
      else if (planResult.reason?.status !== 404)
        setError(planResult.reason?.message || "Không thể tải lộ trình");
      if (historyResult.status === "fulfilled")
        setHistory(historyResult.value.slice(0, 3));
      else
        setError((current) =>
          [current, historyResult.reason?.message].filter(Boolean).join(" · "),
        );
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [accessToken]);

  const todayTasks = useMemo(
    () => plan?.tasks?.filter((task) => task.day_no === plan.current_day) ?? [],
    [plan],
  );
  const daysRemaining = plan
    ? Math.max(0, plan.total_days - plan.current_day + 1)
    : 0;

  if (loading)
    return (
      <Box sx={{ py: 10, display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Đang tải tổng quan học tập" />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Typography variant="h4" mt={1.5}>
          Xin chào{user?.full_name ? `, ${user.full_name}` : ""}!
        </Typography>
        <Typography color="text.secondary" mt={0.75}>
          Theo dõi mục tiêu, nhiệm vụ hôm nay và kết quả luyện tập gần đây.
        </Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}

      {plan ? (
        <>
          <Grid container spacing={2}>
            {[
              [FlagRoundedIcon, "Điểm mục tiêu", plan.target_score ?? "—"],
              [
                CalendarMonthRoundedIcon,
                "Số ngày còn lại",
                `${daysRemaining} ngày`,
              ],
              [
                AssignmentTurnedInRoundedIcon,
                "Nhiệm vụ hôm nay",
                `${todayTasks.length} nhiệm vụ`,
              ],
            ].map(([Icon, label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                  <Icon color="primary" />
                  <Typography color="text.secondary" variant="body2" mt={1}>
                    {label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5}>
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              gap={2}
              mb={2}
            >
              <Box>
                <Typography variant="h6">Nhiệm vụ hôm nay</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày {plan.current_day}/{plan.total_days} của lộ trình
                </Typography>
              </Box>
              <Button
                component={RouterLink}
                to="/student/roadmap"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                Xem lộ trình
              </Button>
            </Stack>
            {todayTasks.length ? (
              <Stack divider={<Divider flexItem />}>
                {todayTasks.map((task) => (
                  <Stack
                    key={task.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    py={1.5}
                    gap={2}
                  >
                    <Box>
                      <Typography fontWeight={650}>{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.type}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={
                        task.status === "COMPLETED" ? "Đã xong" : "Chưa làm"
                      }
                      color={
                        task.status === "COMPLETED" ? "success" : "default"
                      }
                    />
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Alert severity="info">Hôm nay chưa có nhiệm vụ được giao.</Alert>
            )}
          </Paper>
        </>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <RouteRoundedIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h5" mt={1}>
            Bạn chưa có lộ trình học
          </Typography>
          <Typography color="text.secondary" mt={1} mb={3}>
            Thiết lập mục tiêu để nhận lộ trình học tập cá nhân hóa.
          </Typography>
          <Button
            component={RouterLink}
            to="/student/roadmap"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Tạo lộ trình ngay
          </Button>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <HistoryRoundedIcon color="primary" />
          <Typography variant="h6">3 bài luyện tập gần nhất</Typography>
        </Stack>
        {history.length ? (
          <Stack spacing={2}>
            {history.map((item) => (
              <Box key={item.test_id}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography fontWeight={650}>
                      Bài luyện tập #{item.test_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(item.completed_at)} · {item.correct_answers}/
                      {item.total_questions} câu đúng
                    </Typography>
                  </Box>
                  <Typography color="primary" fontWeight={750}>
                    {Number(item.score).toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, Number(item.score) || 0))}
                  sx={{ mt: 1, height: 7, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <Alert severity="info">
            Bạn chưa có bài luyện tập đã hoàn thành.
          </Alert>
        )}
      </Paper>
    </Stack>
  );
}
