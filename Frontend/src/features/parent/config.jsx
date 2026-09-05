import { lazy } from "react";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import ProgressIcon from "@mui/icons-material/TrendingUpRounded";
import { ROLES } from "../auth/config/roles.js";

const ParentOverviewPage = lazy(() => import("./pages/ParentOverviewPage.jsx"));
const ParentProgressPage = lazy(() => import("./pages/ParentProgressPage.jsx"));

export const parentFeature = {
  prefix: "parent",
  role: ROLES.PARENT,
  routes: [
    ["", "Tổng quan phụ huynh", ParentOverviewPage],
    ["progress", "Tiến độ của con", ParentProgressPage],
  ],
  menu: [
    ["Tổng quan", "/parent", DashboardIcon],
    ["Tiến độ của con", "/parent/progress", ProgressIcon],
  ],
};
