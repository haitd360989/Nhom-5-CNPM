import { useEffect, useState } from "react";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const initialValues = { targetScore: "850", examDate: "", dailyHours: "2" };

const today = () => {
  const value = new Date();
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().split("T")[0];
};

function validate(values) {
  const errors = {};
  const targetScore = Number(values.targetScore);
  const dailyHours = Number(values.dailyHours);

  if (!values.targetScore) errors.targetScore = "Vui lòng nhập điểm mục tiêu";
  else if (targetScore < 1 || targetScore > 1200)
    errors.targetScore = "Điểm mục tiêu phải từ 1 đến 1.200";

  if (!values.examDate) errors.examDate = "Vui lòng chọn ngày thi";
  else if (values.examDate <= today())
    errors.examDate = "Ngày thi phải sau ngày hôm nay";

  if (!values.dailyHours) errors.dailyHours = "Vui lòng nhập thời gian học";
  else if (dailyHours < 0.5 || dailyHours > 12)
    errors.dailyHours = "Thời gian học phải từ 0,5 đến 12 giờ";

  return errors;
}

export default function GoalSetupModal({ open, initialGoal, onClose, onSave }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(initialGoal || initialValues);
      setErrors({});
    }
  }, [open, initialGoal]);

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSave(values);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={submit} noValidate>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                p: 1,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <FlagRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h6">Thiết lập mục tiêu học tập</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={400}
              >
                Thông tin này giúp hệ thống xây dựng lộ trình phù hợp với bạn.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3, mt: 1 }}>
            Bạn có thể thay đổi mục tiêu bất cứ lúc nào.
          </Alert>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              required
              fullWidth
              type="number"
              label="Điểm mục tiêu"
              value={values.targetScore}
              onChange={update("targetScore")}
              error={Boolean(errors.targetScore)}
              helperText={errors.targetScore || "Thang điểm từ 1 đến 1.200"}
              slotProps={{
                htmlInput: { min: 1, max: 1200 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">điểm</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              required
              fullWidth
              type="date"
              label="Ngày thi dự kiến"
              value={values.examDate}
              onChange={update("examDate")}
              error={Boolean(errors.examDate)}
              helperText={
                errors.examDate || "Chọn ngày thi chính thức hoặc ngày dự kiến"
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: today() },
              }}
            />
            <TextField
              required
              fullWidth
              type="number"
              label="Thời gian học mỗi ngày"
              value={values.dailyHours}
              onChange={update("dailyHours")}
              error={Boolean(errors.dailyHours)}
              helperText={errors.dailyHours || "Từ 0,5 đến 12 giờ mỗi ngày"}
              slotProps={{
                htmlInput: { min: 0.5, max: 12, step: 0.5 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">giờ/ngày</InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained">
            Lưu mục tiêu
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
