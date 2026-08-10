import {Navigate,Route,Routes} from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout.jsx'
import {HOMES,ROLES} from '../config/roles.js'
import {useAuth} from '../contexts/AuthContext.jsx'
import ProtectedRoute from '../guards/ProtectedRoute.jsx'
import RoleRoute from '../guards/RoleRoute.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import UserManagement from '../pages/admin/UserManagement.jsx'
import SystemSettings from '../pages/admin/SystemSettings.jsx'
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx'
import QuestionBank from '../pages/teacher/QuestionBank.jsx'
import KnowledgeBase from '../pages/teacher/KnowledgeBase.jsx'
import StudentAnalytics from '../pages/teacher/StudentAnalytics.jsx'
import StudentDashboard from '../pages/student/StudentDashboard.jsx'
import DiagnosticAssessment from '../pages/student/DiagnosticAssessment.jsx'
import LearningRoadmap from '../pages/student/LearningRoadmap.jsx'
import Practice from '../pages/student/Practice.jsx'
import AiTutor from '../pages/student/AiTutor.jsx'
import StudentProgress from '../pages/student/StudentProgress.jsx'
import ParentDashboard from '../pages/parent/ParentDashboard.jsx'
import ChildProgress from '../pages/parent/ChildProgress.jsx'
import UnauthorizedPage from '../pages/common/UnauthorizedPage.jsx'
import NotFoundPage from '../pages/common/NotFoundPage.jsx'

function Home(){const{user}=useAuth();return <Navigate to={user?HOMES[user.role]:'/login'} replace/>}

export default function AppRouter(){return <Routes>
  <Route path="/" element={<Home/>}/><Route path="/login" element={<LoginPage/>}/>
  <Route element={<ProtectedRoute/>}><Route element={<MainLayout/>}>
    <Route path="unauthorized" element={<UnauthorizedPage/>}/>
    <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]}/>}><Route path="admin" element={<AdminDashboard/>}/><Route path="admin/users" element={<UserManagement/>}/><Route path="admin/settings" element={<SystemSettings/>}/></Route>
    <Route element={<RoleRoute allowedRoles={[ROLES.TEACHER]}/>}><Route path="teacher" element={<TeacherDashboard/>}/><Route path="teacher/questions" element={<QuestionBank/>}/><Route path="teacher/knowledge" element={<KnowledgeBase/>}/><Route path="teacher/analytics" element={<StudentAnalytics/>}/></Route>
    <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT]}/>}><Route path="student" element={<StudentDashboard/>}/><Route path="student/assessment" element={<DiagnosticAssessment/>}/><Route path="student/roadmap" element={<LearningRoadmap/>}/><Route path="student/practice" element={<Practice/>}/><Route path="student/tutor" element={<AiTutor/>}/><Route path="student/progress" element={<StudentProgress/>}/></Route>
    <Route element={<RoleRoute allowedRoles={[ROLES.PARENT]}/>}><Route path="parent" element={<ParentDashboard/>}/><Route path="parent/progress" element={<ChildProgress/>}/></Route>
  </Route></Route><Route path="*" element={<NotFoundPage/>}/>
</Routes>}
