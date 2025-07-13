import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../services/api';
import { Enrollment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMyEnrollments();
    }
  }, [user]);

  const fetchMyEnrollments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const enrollmentList = await courseApi.getMyEnrollments(user.id);
      setEnrollments(enrollmentList);
    } catch (err: any) {
      setError(err.response?.data?.message || '수강 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (enrollmentId: number) => {
    if (!window.confirm('수강 신청을 취소하시겠습니까?')) {
      return;
    }

    try {
      await courseApi.cancelEnrollment(enrollmentId);
      alert('수강 신청이 취소되었습니다.');
      fetchMyEnrollments(); // 목록 새로고침
    } catch (err: any) {
      alert(err.response?.data?.message || '수강 신청 취소에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>승인됨</span>;
      case 'PENDING':
        return <span className="badge bg-warning"><i className="bi bi-hourglass-split me-1"></i>승인 대기</span>;
      case 'REJECTED':
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>거절됨</span>;
      case 'CANCELLED':
        return <span className="badge bg-secondary"><i className="bi bi-dash-circle me-1"></i>취소됨</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getCourseStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge bg-success"><i className="bi bi-play-circle me-1"></i>진행중</span>;
      case 'FULL':
        return <span className="badge bg-warning"><i className="bi bi-people-fill me-1"></i>정원마감</span>;
      case 'INACTIVE':
        return <span className="badge bg-secondary"><i className="bi bi-pause-circle me-1"></i>비활성</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          로그인이 필요한 페이지입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">마이페이지</h1>
          
          {/* 사용자 정보 */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-person-circle me-2"></i>사용자 정보
              </h5>
              <div className="row">
                <div className="col-md-6 col-12">
                  <p className="mb-2">
                    <strong>이름:</strong> {user.name}
                  </p>
                  <p className="mb-2">
                    <strong>이메일:</strong> {user.email}
                  </p>
                </div>
                <div className="col-md-6 col-12">
                  <p className="mb-2">
                    <strong>사용자 유형:</strong> {user.userType}
                  </p>
                  <p className="mb-2">
                    <strong>가입일:</strong> {user.createdAt ? formatDate(user.createdAt) : '정보 없음'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 수강 내역 */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-list-check me-2"></i>수강 내역
              </h5>
              
              {loading ? (
                <div className="d-flex justify-content-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>{error}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  수강 신청한 과정이 없습니다.
                  <Link to="/courses" className="btn btn-primary ms-2">
                    <i className="bi bi-search me-1"></i>과정 둘러보기
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>과정명</th>
                        <th>카테고리</th>
                        <th>강사</th>
                        <th>수강 기간</th>
                        <th>가격</th>
                        <th>과정 상태</th>
                        <th>신청 상태</th>
                        <th>신청일</th>
                        <th>액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td>
                            <Link
                              to={`/courses/${enrollment.course.id}`}
                              className="text-decoration-none"
                            >
                              {enrollment.course.title}
                            </Link>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {enrollment.course.category}
                            </span>
                          </td>
                          <td>{enrollment.course.instructor}</td>
                          <td>
                            {formatDate(enrollment.course.startDate)} ~<br />
                            {formatDate(enrollment.course.endDate)}
                          </td>
                          <td>{formatPrice(enrollment.course.price)}원</td>
                          <td>{getCourseStatusBadge(enrollment.course.status)}</td>
                          <td>{getStatusBadge(enrollment.status)}</td>
                          <td>{formatDate(enrollment.enrolledAt)}</td>
                          <td>
                            {enrollment.status === 'PENDING' && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleCancelEnrollment(enrollment.id)}
                              >
                                <i className="bi bi-x-circle me-1"></i>취소
                              </button>
                            )}
                            {enrollment.status === 'APPROVED' && (
                              <span className="text-success small">
                                <i className="bi bi-check-circle me-1"></i>수강 중
                              </span>
                            )}
                            {enrollment.status === 'REJECTED' && (
                              <span className="text-danger small">
                                <i className="bi bi-x-circle me-1"></i>거절됨
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;