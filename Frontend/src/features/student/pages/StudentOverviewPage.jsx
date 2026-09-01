import { useEffect, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { studyPlanApi } from "../api.js";

export default function StudentOverviewPage() {
  const { accessToken, user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    studyPlanApi
      .getCurrent(accessToken)
      .then((data) => active && setPlan(data))
      .catch((requestError) => {
        if (active && requestError.status !== 404)
          setError(requestError.message);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [accessToken]);

  const completedTasks =
    plan?.tasks?.filter((task) => task.status === "COMPLETED").length ?? 0;

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Typography variant="h4" mt={1.5}>
          Xin chào{user?.full_name ? `, ${user.full_name}` : ""}!
        </Typography>
        <Typography color="text.secondary" mt={0.75}>
          Theo dõi lộ trình và tiếp tục mục tiêu học tập của bạn.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
          <CircularProgress aria-label="Đang tải lộ trình" />
        </Box>
      ) : plan ? (
        <>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              gap={2}
            >
              <Box>
                <Typography variant="overline" color="primary.main">
                  Lộ trình hiện tại
                </Typography>
                <Typography variant="h5">{plan.title}</Typography>
              </Box>
              <Button
                component={RouterLink}
                to="/student/roadmap"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                Xem lộ trình
              </Button>
            </Stack>
          </Paper>

          <Grid container spacing={2}>
            {[
              [FlagRoundedIcon, "Điểm mục tiêu", plan.target_score ?? "—"],
              [
                RouteRoundedIcon,
                "Ngày hiện tại",
                `${plan.current_day}/${plan.total_days}`,
              ],
              [
                CheckCircleRoundedIcon,
                "Nhiệm vụ hoàn thành",
                `${completedTasks}/${plan.tasks?.length ?? 0}`,
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
    </Stack>
  );
}
