import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyPage from './pages/MyPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminEnrollments from './pages/AdminEnrollments';
import NoticeBoard from './pages/NoticeBoard';
import NoticeDetail from './pages/NoticeDetail';
import NoticeWrite from './pages/NoticeWrite';
import QnABoard from './pages/QnABoard';
import QnADetail from './pages/QnADetail';
import QnAWrite from './pages/QnAWrite';
import { UserType } from './types';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.userType === UserType.ADMIN ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/board/notice" element={<NoticeBoard />} />
            <Route path="/board/notice/:id" element={<NoticeDetail />} />
            <Route 
              path="/board/notice/write" 
              element={
                <AdminRoute>
                  <NoticeWrite />
                </AdminRoute>
              } 
            />
            <Route 
              path="/board/notice/:id/edit" 
              element={
                <AdminRoute>
                  <NoticeWrite />
                </AdminRoute>
              } 
            />
            <Route path="/qna" element={<QnABoard />} />
            <Route path="/qna/:id" element={<QnADetail />} />
            <Route 
              path="/qna/write" 
              element={
                <ProtectedRoute>
                  <QnAWrite />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/qna/edit/:id" 
              element={
                <ProtectedRoute>
                  <QnAWrite />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage" 
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/courses" 
              element={
                <AdminRoute>
                  <AdminCourses />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/enrollments" 
              element={
                <AdminRoute>
                  <AdminEnrollments />
                </AdminRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
