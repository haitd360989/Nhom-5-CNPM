import DashboardIcon from "@mui/icons-material/DashboardRounded";
import QuizIcon from "@mui/icons-material/QuizRounded";
import BookIcon from "@mui/icons-material/MenuBookRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
import { lazy } from "react";
import { ROLES } from "../auth/config/roles.js";

const TeacherOverviewPage = lazy(
  () => import("./pages/TeacherOverviewPage.jsx"),
);
const TeacherQuestionsPage = lazy(
  () => import("./pages/TeacherQuestionsPage.jsx"),
);
const TeacherKnowledgePage = lazy(
  () => import("./pages/TeacherKnowledgePage.jsx"),
);
const TeacherAnalyticsPage = lazy(
  () => import("./pages/TeacherAnalyticsPage.jsx"),
);

export const teacherFeature = {
  prefix: "teacher",
  role: ROLES.TEACHER,
  routes: [
    ["", "Tổng quan giáo viên", TeacherOverviewPage],
    ["questions", "Ngân hàng câu hỏi", TeacherQuestionsPage],
    ["knowledge", "Kho tri thức", TeacherKnowledgePage],
    ["analytics", "Phân tích học sinh", TeacherAnalyticsPage],
  ],
  menu: [
    ["Tổng quan", "/teacher", DashboardIcon],
    ["Ngân hàng câu hỏi", "/teacher/questions", QuizIcon],
    ["Kho tri thức", "/teacher/knowledge", BookIcon],
    ["Phân tích học sinh", "/teacher/analytics", AnalyticsIcon],
  ],
};
