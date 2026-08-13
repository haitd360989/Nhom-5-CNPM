import DashboardIcon from "@mui/icons-material/DashboardRounded";
import PeopleIcon from "@mui/icons-material/ManageAccountsRounded";
import SettingsIcon from "@mui/icons-material/SettingsRounded";
import { ROLES } from "../auth/config/roles.js";

export const adminFeature = {
  prefix: "admin",
  role: ROLES.ADMIN,
  routes: [
    ["", "Tổng quan quản trị"],
    ["users", "Quản lý tài khoản"],
    ["settings", "Cấu hình hệ thống"],
  ],
  menu: [
    ["Tổng quan", "/admin", DashboardIcon],
    ["Quản lý tài khoản", "/admin/users", PeopleIcon],
    ["Cấu hình hệ thống", "/admin/settings", SettingsIcon],
  ],
};
