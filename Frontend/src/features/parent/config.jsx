import DashboardIcon from "@mui/icons-material/DashboardRounded";
import ProgressIcon from "@mui/icons-material/TrendingUpRounded";
import { ROLES } from "../auth/config/roles.js";

export const parentFeature = {
  prefix: "parent",
  role: ROLES.PARENT,
  routes: [
    ["", "Tổng quan phụ huynh"],
    ["progress", "Tiến độ của con"],
  ],
  menu: [
    ["Tổng quan", "/parent", DashboardIcon],
    ["Tiến độ của con", "/parent/progress", ProgressIcon],
  ],
};
