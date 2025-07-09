import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseApi, adminApi } from '../services/api';
import { Course, Enrollment, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    activeCourses: 0,
    fullCourses: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userType === 'ADMIN') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // 관리자 전용 API 호출
      const dashboardStats = await adminApi.getDashboardStats();
      const coursesResult = await courseApi.getCourses({ size: 100 });
      
      setStats({
        totalUsers: dashboardStats.totalUsers,
        totalCourses: dashboardStats.totalCourses,
        totalEnrollments: dashboardStats.totalEnrollments,
        pendingEnrollments: dashboardStats.pendingEnrollments,
        activeCourses: coursesResult.courses.filter(c => c.status === 'ACTIVE').length,
        fullCourses: coursesResult.courses.filter(c => c.status === 'FULL').length
      });

      // Mock recent enrollments
      setRecentEnrollments([]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.userType !== 'ADMIN') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-shield-exclamation me-2"></i>
          관리자 권한이 필요합니다.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>
              <i className="bi bi-speedometer2 me-2"></i>
              관리자 대시보드
            </h1>
            <span className="badge bg-primary">
              <i className="bi bi-person-badge me-1"></i>
              {user.name} 관리자
            </span>
          </div>

          {/* 통계 카드 */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalUsers}</h4>
                      <p className="card-text">전체 회원</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-people fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalCourses}</h4>
                      <p className="card-text">전체 과정</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-book fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalEnrollments}</h4>
                      <p className="card-text">총 수강신청</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-person-check fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.pendingEnrollments}</h4>
                      <p className="card-text">승인 대기</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-hourglass-split fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 액션 버튼 */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-lightning-charge me-2"></i>
                    빠른 관리
                  </h5>
                  <div className="row">
                    <div className="col-md-3 mb-2">
                      <a href="/admin/users" className="btn btn-outline-primary w-100">
                        <i className="bi bi-person-gear me-2"></i>
                        회원 관리
                      </a>
                    </div>
                    <div className="col-md-3 mb-2">
                      <a href="/admin/courses" className="btn btn-outline-success w-100">
                        <i className="bi bi-book-half me-2"></i>
                        과정 관리
                      </a>
                    </div>
                    <div className="col-md-3 mb-2">
                      <a href="/admin/enrollments" className="btn btn-outline-info w-100">
                        <i className="bi bi-clipboard-check me-2"></i>
                        수강신청 관리
                      </a>
                    </div>
                    <div className="col-md-3 mb-2">
                      <a href="/admin/reports" className="btn btn-outline-warning w-100">
                        <i className="bi bi-graph-up me-2"></i>
                        통계 리포트
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 과정 현황 */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-pie-chart me-2"></i>
                    과정 현황
                  </h5>
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="border-end">
                        <h4 className="text-success">{stats.activeCourses}</h4>
                        <small className="text-muted">모집중</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border-end">
                        <h4 className="text-warning">{stats.fullCourses}</h4>
                        <small className="text-muted">정원마감</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <h4 className="text-secondary">{stats.totalCourses - stats.activeCourses - stats.fullCourses}</h4>
                      <small className="text-muted">비활성</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-bell me-2"></i>
                    알림
                  </h5>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i className="bi bi-exclamation-circle text-warning me-2"></i>
                        승인 대기 수강신청
                      </span>
                      <span className="badge bg-warning rounded-pill">{stats.pendingEnrollments}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i className="bi bi-person-plus text-primary me-2"></i>
                        신규 회원 가입
                      </span>
                      <span className="badge bg-primary rounded-pill">3</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i className="bi bi-building text-info me-2"></i>
                        협약사 신청
                      </span>
                      <span className="badge bg-info rounded-pill">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-clock-history me-2"></i>
                    최근 활동
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>시간</th>
                          <th>활동</th>
                          <th>사용자</th>
                          <th>상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>2분 전</td>
                          <td>
                            <i className="bi bi-person-plus text-primary me-2"></i>
                            React 기초부터 실전까지 수강신청
                          </td>
                          <td>김학생</td>
                          <td><span className="badge bg-warning">대기</span></td>
                        </tr>
                        <tr>
                          <td>5분 전</td>
                          <td>
                            <i className="bi bi-person-check text-success me-2"></i>
                            Spring Boot 마스터 클래스 승인
                          </td>
                          <td>이개발</td>
                          <td><span className="badge bg-success">승인</span></td>
                        </tr>
                        <tr>
                          <td>10분 전</td>
                          <td>
                            <i className="bi bi-person-add text-info me-2"></i>
                            새로운 회원 가입
                          </td>
                          <td>박신입</td>
                          <td><span className="badge bg-info">신규</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;