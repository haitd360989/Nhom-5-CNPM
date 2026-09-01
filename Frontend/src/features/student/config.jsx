import DashboardIcon from "@mui/icons-material/DashboardRounded";
import CheckIcon from "@mui/icons-material/FactCheckRounded";
import RouteIcon from "@mui/icons-material/RouteRounded";
import PracticeIcon from "@mui/icons-material/FitnessCenterRounded";
import TutorIcon from "@mui/icons-material/SmartToyRounded";
import ProgressIcon from "@mui/icons-material/TrendingUpRounded";
import { lazy } from "react";
import { ROLES } from "../auth/config/roles.js";

const DiagnosticAssessmentPage = lazy(
  () => import("./pages/DiagnosticAssessmentPage.jsx"),
);
const LearningRoadmapPage = lazy(
  () => import("./pages/LearningRoadmapPage.jsx"),
);
const PracticeConfigPage = lazy(() => import("./pages/PracticeConfigPage.jsx"));
const PracticeExamPage = lazy(() => import("./pages/PracticeExamPage.jsx"));
const TutorChatPage = lazy(() => import("./pages/TutorChatPage.jsx"));
const StudentOverviewPage = lazy(
  () => import("./pages/StudentOverviewPage.jsx"),
);
const StudentProgressPage = lazy(
  () => import("./pages/StudentProgressPage.jsx"),
);

export const studentFeature = {
  prefix: "student",
  role: ROLES.STUDENT,
  routes: [
    ["", "Tổng quan học tập", StudentOverviewPage],
    ["assessment", "Đánh giá năng lực", DiagnosticAssessmentPage],
    ["roadmap", "Lộ trình học", LearningRoadmapPage],
    ["practice", "Luyện tập", PracticeConfigPage],
    ["practice/exam", "Bài luyện tập", PracticeExamPage],
    ["tutor", "AI Tutor", TutorChatPage],
    ["progress", "Tiến độ", StudentProgressPage],
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
