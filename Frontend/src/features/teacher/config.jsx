import DashboardIcon from "@mui/icons-material/DashboardRounded";
import QuizIcon from "@mui/icons-material/QuizRounded";
import BookIcon from "@mui/icons-material/MenuBookRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
import { lazy } from "react";
import { ROLES } from "../auth/config/roles.js";

const TeacherQuestionsPage = lazy(
  () => import("./pages/TeacherQuestionsPage.jsx"),
);

export const teacherFeature = {
  prefix: "teacher",
  role: ROLES.TEACHER,
  routes: [
    ["", "Tổng quan giáo viên"],
    ["questions", "Ngân hàng câu hỏi", TeacherQuestionsPage],
    ["knowledge", "Kho tri thức"],
    ["analytics", "Phân tích học sinh"],
  ],
  menu: [
    ["Tổng quan", "/teacher", DashboardIcon],
    ["Ngân hàng câu hỏi", "/teacher/questions", QuizIcon],
    ["Kho tri thức", "/teacher/knowledge", BookIcon],
    ["Phân tích học sinh", "/teacher/analytics", AnalyticsIcon],
  ],
};
