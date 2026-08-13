import { adminFeature } from "./admin/config.jsx";
import { parentFeature } from "./parent/config.jsx";
import { studentFeature } from "./student/config.jsx";
import { teacherFeature } from "./teacher/config.jsx";

export const roleFeatures = [
  adminFeature,
  teacherFeature,
  studentFeature,
  parentFeature,
];
export const menuConfig = Object.fromEntries(
  roleFeatures.map((feature) => [feature.role, feature.menu]),
);
