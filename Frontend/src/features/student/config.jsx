import DashboardIcon from "@mui/icons-material/DashboardRounded";
import CheckIcon from "@mui/icons-material/FactCheckRounded";
import RouteIcon from "@mui/icons-material/RouteRounded";
import PracticeIcon from "@mui/icons-material/FitnessCenterRounded";
import TutorIcon from "@mui/icons-material/SmartToyRounded";
import ProgressIcon from "@mui/icons-material/TrendingUpRounded";
import { ROLES } from "../auth/config/roles.js";

export const studentFeature = {
  prefix: "student",
  role: ROLES.STUDENT,
  routes: [
    ["", "Tổng quan học tập"],
    ["assessment", "Đánh giá năng lực"],
    ["roadmap", "Lộ trình học"],
    ["practice", "Luyện tập"],
    ["tutor", "AI Tutor"],
    ["progress", "Tiến độ"],
  ],
  menu: [
    ["Tổng quan", "/student", DashboardIcon],
    ["Đánh giá năng lực", "/student/assessment", CheckIcon],
    ["Lộ trình học", "/student/roadmap", RouteIcon],
    ["Luyện tập", "/student/practice", PracticeIcon],
    ["AI Tutor", "/student/tutor", TutorIcon],
    ["Tiến độ", "/student/progress", ProgressIcon],
  ],
};
