import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseApi, adminApi } from '../services/api';
import { Enrollment, EnrollmentStatus, UserType, Authority } from '../types';

const AdminEnrollments: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock 수강신청 데이터
  const mockEnrollments: Enrollment[] = [
    {
      id: 1,
      userId: 2,
      courseId: 1,
      status: EnrollmentStatus.PENDING,
      enrolledAt: '2025-01-20T10:00:00Z',
      course: {
        id: 1,
        title: 'React 기초부터 실전까지',
        description: 'React의 기본 개념부터 실무에서 사용하는 고급 기능까지',
        instructor: '김개발',
        category: '프론트엔드',
        capacity: 30,
        currentEnrollment: 12,
        startDate: '2025-08-01',
        endDate: '2025-09-30',
        duration: '8주',
        price: 350000,
        status: 'ACTIVE',
        createdAt: '2025-07-01T00:00:00Z',
        updatedAt: '2025-07-01T00:00:00Z'
      },
      user: {
        id: 2,
        email: 'employee@test.com',
        name: '김재직',
        phoneNumber: '010-2345-6789',
        userType: UserType.EMPLOYEE,
        status: 'ACTIVE',
        authorities: [Authority.USER]
      }
    },
    {
      id: 2,
      userId: 3,
      courseId: 2,
      status: EnrollmentStatus.APPROVED,
      enrolledAt: '2025-01-18T14:30:00Z',
      approvedAt: '2025-01-19T09:00:00Z',
      course: {
        id: 2,
        title: 'Spring Boot 마스터 클래스',
        description: 'Spring Boot를 활용한 REST API 개발',
        instructor: '박백엔드',
        category: '백엔드',
        capacity: 25,
        currentEnrollment: 8,
        startDate: '2025-08-15',
        endDate: '2025-10-15',
        duration: '10주',
        price: 420000,
        status: 'ACTIVE',
        createdAt: '2025-07-01T00:00:00Z',
        updatedAt: '2025-07-01T00:00:00Z'
      },
      user: {
        id: 3,
        email: 'jobseeker@test.com',
        name: '이구직',
        phoneNumber: '010-3456-7890',
        userType: UserType.JOB_SEEKER,
        status: 'ACTIVE',
        authorities: [Authority.USER]
      }
    },
    {
      id: 3,
      userId: 4,
      courseId: 1,
      status: EnrollmentStatus.REJECTED,
      enrolledAt: '2025-01-17T11:15:00Z',
      course: {
        id: 1,
        title: 'React 기초부터 실전까지',
        description: 'React의 기본 개념부터 실무에서 사용하는 고급 기능까지',
        instructor: '김개발',
        category: '프론트엔드',
        capacity: 30,
        currentEnrollment: 12,
        startDate: '2025-08-01',
        endDate: '2025-09-30',
        duration: '8주',
        price: 350000,
        status: 'ACTIVE',
        createdAt: '2025-07-01T00:00:00Z',
        updatedAt: '2025-07-01T00:00:00Z'
      },
      user: {
        id: 4,
        email: 'company@test.com',
        name: '박협약',
        phoneNumber: '010-4567-8901',
        userType: UserType.COMPANY,
        status: 'ACTIVE',
        authorities: [Authority.COMPANY, Authority.USER],
        companyName: '테스트협약사'
      }
    }
  ];

  useEffect(() => {
    if (user?.userType === UserType.ADMIN) {
      loadEnrollments();
    }
  }, [user]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      // 실제로는 API 호출
      // const result = await enrollmentApi.getAllEnrollments();
      await new Promise(resolve => setTimeout(resolve, 500));
      setEnrollments(mockEnrollments);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId: number) => {
    try {
      await adminApi.approveEnrollment(enrollmentId);
      setEnrollments(enrollments.map(e => 
        e.id === enrollmentId ? { 
          ...e, 
          status: EnrollmentStatus.APPROVED,
          approvedAt: new Date().toISOString()
        } : e
      ));
      alert('수강신청이 승인되었습니다.');
    } catch (error) {
      console.error('Enrollment approval error:', error);
      const errorMessage = error instanceof Error ? error.message : '승인 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleReject = async (enrollmentId: number) => {
    if (!window.confirm('정말로 이 수강신청을 거절하시겠습니까?')) {
      return;
    }
    
    try {
      await adminApi.rejectEnrollment(enrollmentId);
      setEnrollments(enrollments.map(e => 
        e.id === enrollmentId ? { ...e, status: EnrollmentStatus.REJECTED } : e
      ));
      alert('수강신청이 거절되었습니다.');
    } catch (error) {
      console.error('Enrollment rejection error:', error);
      const errorMessage = error instanceof Error ? error.message : '거절 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesFilter = filter === 'all' || enrollment.status === filter;
    const matchesSearch = enrollment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.APPROVED:
        return <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>승인됨</span>;
      case EnrollmentStatus.PENDING:
        return <span className="badge bg-warning"><i className="bi bi-hourglass-split me-1"></i>승인 대기</span>;
      case EnrollmentStatus.REJECTED:
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>거절됨</span>;
      case EnrollmentStatus.CANCELLED:
        return <span className="badge bg-secondary"><i className="bi bi-dash-circle me-1"></i>취소됨</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (user?.userType !== UserType.ADMIN) {
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
              <i className="bi bi-clipboard-check me-2"></i>
              수강신청 관리
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/admin">관리자</a></li>
                <li className="breadcrumb-item active">수강신청 관리</li>
              </ol>
            </nav>
          </div>

          {/* 필터 및 검색 */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-funnel"></i></span>
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">전체 상태</option>
                  <option value="PENDING">승인 대기</option>
                  <option value="APPROVED">승인됨</option>
                  <option value="REJECTED">거절됨</option>
                  <option value="CANCELLED">취소됨</option>
                </select>
              </div>
            </div>
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="사용자명 또는 과정명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-primary">{enrollments.length}</h4>
                  <p className="text-muted mb-0">전체 신청</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-warning">{enrollments.filter(e => e.status === EnrollmentStatus.PENDING).length}</h4>
                  <p className="text-muted mb-0">승인 대기</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-success">{enrollments.filter(e => e.status === EnrollmentStatus.APPROVED).length}</h4>
                  <p className="text-muted mb-0">승인 완료</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-danger">{enrollments.filter(e => e.status === EnrollmentStatus.REJECTED).length}</h4>
                  <p className="text-muted mb-0">거절됨</p>
                </div>
              </div>
            </div>
          </div>

          {/* 수강신청 목록 */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>신청자</th>
                      <th>과정</th>
                      <th>강사</th>
                      <th>카테고리</th>
                      <th>가격</th>
                      <th>신청일</th>
                      <th>상태</th>
                      <th>승인일</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrollments.map(enrollment => (
                      <tr key={enrollment.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2"></i>
                            <div>
                              <div className="fw-bold">{enrollment.user.name}</div>
                              <small className="text-muted">{enrollment.user.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">{enrollment.course.title}</div>
                            <small className="text-muted">{enrollment.course.duration}</small>
                          </div>
                        </td>
                        <td>
                          {enrollment.course.instructor}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {enrollment.course.category}
                          </span>
                        </td>
                        <td>
                          {formatPrice(enrollment.course.price)}원
                        </td>
                        <td>{formatDate(enrollment.enrolledAt)}</td>
                        <td>{getStatusBadge(enrollment.status as EnrollmentStatus)}</td>
                        <td>
                          {enrollment.approvedAt ? (
                            formatDate(enrollment.approvedAt)
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {enrollment.status === EnrollmentStatus.PENDING && (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleApprove(enrollment.id)}
                                  title="승인"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleReject(enrollment.id)}
                                  title="거절"
                                >
                                  <i className="bi bi-x-circle"></i>
                                </button>
                              </>
                            )}
                            {enrollment.status === EnrollmentStatus.APPROVED && (
                              <span className="text-success small">
                                <i className="bi bi-check-circle me-1"></i>
                                승인 완료
                              </span>
                            )}
                            {enrollment.status === EnrollmentStatus.REJECTED && (
                              <span className="text-danger small">
                                <i className="bi bi-x-circle me-1"></i>
                                거절됨
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredEnrollments.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-clipboard-x fs-1 text-muted"></i>
                  <p className="text-muted mt-2">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollments;