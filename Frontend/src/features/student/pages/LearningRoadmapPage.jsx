import { useState } from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import GoalSetupModal from "../components/GoalSetupModal.jsx";

const STORAGE_KEY = "swr-act-learning-goal";

function readGoal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

const formatDate = (value) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

export default function LearningRoadmapPage() {
  const [goal, setGoal] = useState(readGoal);
  const [open, setOpen] = useState(!goal);

  const saveGoal = (values) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setGoal(values);
    setOpen(false);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Chip label="Học viên" color="primary" size="small" />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={2}
          mt={1.5}
        >
          <Box>
            <Typography variant="h4">Lộ trình học</Typography>
            <Typography color="text.secondary" mt={0.75}>
              Thiết lập mục tiêu để bắt đầu lộ trình cá nhân hóa.
            </Typography>
          </Box>
          <Button
            variant={goal ? "outlined" : "contained"}
            startIcon={goal ? <EditRoundedIcon /> : <FlagRoundedIcon />}
            onClick={() => setOpen(true)}
          >
            {goal ? "Chỉnh sửa mục tiêu" : "Thiết lập mục tiêu"}
          </Button>
        </Stack>
      </Box>

      {goal ? (
        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h6" mb={2.5}>
            Mục tiêu hiện tại
          </Typography>
          <Grid container spacing={2}>
            {[
              [
                FlagRoundedIcon,
                "Điểm mục tiêu",
                `${Number(goal.targetScore).toLocaleString("vi-VN")} điểm`,
              ],
              [CalendarMonthRoundedIcon, "Ngày thi", formatDate(goal.examDate)],
              [
                ScheduleRoundedIcon,
                "Thời gian học",
                `${goal.dailyHours} giờ/ngày`,
              ],
            ].map(([Icon, label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "background.default",
                    height: "100%",
                  }}
                >
                  <Icon color="primary" />
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {label}
                  </Typography>
                  <Typography fontWeight={700} mt={0.25}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            minHeight: 260,
            display: "grid",
            placeItems: "center",
            borderStyle: "dashed",
            textAlign: "center",
          }}
        >
          <Box>
            <FlagRoundedIcon color="primary" sx={{ fontSize: 44 }} />
            <Typography variant="h6" mt={1}>
              Bạn chưa thiết lập mục tiêu
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Hãy cho chúng tôi biết đích đến và quỹ thời gian của bạn.
            </Typography>
          </Box>
        </Paper>
      )}

      <GoalSetupModal
        open={open}
        initialGoal={goal}
        onClose={() => setOpen(false)}
        onSave={saveGoal}
      />
    </Stack>
  );
}
