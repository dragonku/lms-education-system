import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi } from '../services/api';
import { Course, Enrollment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'none' | 'enrolled' | 'pending'>('none');

  useEffect(() => {
    if (id) {
      fetchCourse();
      checkEnrollmentStatus();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const courseData = await courseApi.getCourse(parseInt(id));
      setCourse(courseData);
    } catch (err: any) {
      setError(err.response?.data?.message || '과정 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!user || !id) return;
    
    try {
      const enrollments = await courseApi.getMyEnrollments(user.id);
      const currentEnrollment = enrollments.find(e => e.courseId === parseInt(id));
      
      if (currentEnrollment) {
        setEnrollmentStatus(currentEnrollment.status === 'APPROVED' ? 'enrolled' : 'pending');
      }
    } catch (err) {
      console.error('Failed to check enrollment status:', err);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;
    
    try {
      setEnrolling(true);
      await courseApi.enrollCourse({
        courseId: course.id,
        userId: user.id
      });
      
      setEnrollmentStatus('pending');
      
      // 과정 정보 새로고침 (정원 업데이트)
      await fetchCourse();
      
      alert('수강 신청이 완료되었습니다. 관리자 승인을 기다려주세요.');
    } catch (err: any) {
      alert(err.response?.data?.message || '수강 신청에 실패했습니다.');
    } finally {
      setEnrolling(false);
    }
  };

  const getStatusBadge = (course: Course) => {
    if (course.status === 'FULL') {
      return <span className="badge bg-danger"><i className="bi bi-person-fill-x me-1"></i>정원마감</span>;
    } else if (course.status === 'ACTIVE') {
      return <span className="badge bg-success"><i className="bi bi-person-fill-check me-1"></i>모집중</span>;
    } else {
      return <span className="badge bg-secondary"><i className="bi bi-pause-circle me-1"></i>비활성</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getEnrollmentButton = () => {
    if (!user) {
      return (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/login')}
        >
          로그인 후 수강신청
        </button>
      );
    }

    if (enrollmentStatus === 'enrolled') {
      return (
        <button className="btn btn-success btn-lg" disabled>
          <i className="bi bi-check-circle me-2"></i>수강 중
        </button>
      );
    }

    if (enrollmentStatus === 'pending') {
      return (
        <button className="btn btn-warning btn-lg" disabled>
          <i className="bi bi-hourglass-split me-2"></i>승인 대기중
        </button>
      );
    }

    if (course?.status === 'FULL') {
      return (
        <button className="btn btn-danger btn-lg" disabled>
          <i className="bi bi-person-fill-x me-2"></i>정원마감
        </button>
      );
    }

    if (course?.status === 'INACTIVE') {
      return (
        <button className="btn btn-secondary btn-lg" disabled>
          <i className="bi bi-pause-circle me-2"></i>모집 중단
        </button>
      );
    }

    return (
      <button
        className="btn btn-primary btn-lg"
        onClick={handleEnroll}
        disabled={enrolling}
      >
        {enrolling ? (
          <><i className="bi bi-arrow-repeat spin me-2"></i>신청 중...</>
        ) : (
          <><i className="bi bi-person-plus me-2"></i>수강 신청</>
        )}
      </button>
    );
  };

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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/courses')}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          과정을 찾을 수 없습니다.
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/courses')}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => navigate('/courses')}
                >
                  과정 목록
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {course.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="position-relative" style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
              {course.imageUrl && course.imageUrl.trim() !== '' ? (
                <>
                  <img
                    src={course.imageUrl}
                    className="card-img-top"
                    alt={course.title}
                    style={{ height: '300px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="d-flex align-items-center justify-content-center h-100"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center text-muted">
                      <i className="bi bi-book" style={{ fontSize: '4rem' }}></i>
                      <div className="mt-3">
                        <h4>{course.category}</h4>
                        <small>과정 이미지</small>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center text-muted">
                    <i className="bi bi-book" style={{ fontSize: '4rem' }}></i>
                    <div className="mt-3">
                      <h4>{course.category}</h4>
                      <small>과정 이미지</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1 className="card-title">{course.title}</h1>
                {getStatusBadge(course)}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-2">
                    <i className="bi bi-bookmark-fill text-primary me-2"></i>
                    <strong>카테고리:</strong> {course.category}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-person-fill text-primary me-2"></i>
                    <strong>강사:</strong> {course.instructor}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-clock-fill text-primary me-2"></i>
                    <strong>기간:</strong> {course.duration}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <i className="bi bi-calendar-event-fill text-success me-2"></i>
                    <strong>시작일:</strong> {formatDate(course.startDate)}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-calendar-check-fill text-danger me-2"></i>
                    <strong>종료일:</strong> {formatDate(course.endDate)}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-people-fill text-info me-2"></i>
                    <strong>정원:</strong> {course.currentEnrollment}/{course.capacity}명
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <h5>과정 설명</h5>
                <p className="text-muted">{course.description}</p>
              </div>

              <div className="mb-3">
                <h6><i className="bi bi-bar-chart-fill me-2"></i>수강 현황</h6>
                <div className="progress mb-2" style={{ height: '20px' }}>
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${(course.currentEnrollment / course.capacity) * 100}%` }}
                    aria-valuenow={course.currentEnrollment}
                    aria-valuemin={0}
                    aria-valuemax={course.capacity}
                  >
                    {Math.round((course.currentEnrollment / course.capacity) * 100)}%
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    <i className="bi bi-people me-1"></i>
                    {course.currentEnrollment}명 수강 중
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-person-lines-fill me-1"></i>
                    정원: {course.capacity}명
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title">수강 정보</h5>
              
              <div className="mb-3 text-center">
                <div className="display-6 text-primary fw-bold">
                  <i className="bi bi-currency-dollar me-1"></i>
                  {formatPrice(course.price)}원
                </div>
              </div>

              <div className="mb-3">
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                    <span><i className="bi bi-clock me-2"></i>수강 기간</span>
                    <span className="fw-bold">{course.duration}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                    <span><i className="bi bi-calendar-event me-2"></i>시작일</span>
                    <span className="fw-bold">{formatDate(course.startDate)}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                    <span><i className="bi bi-calendar-check me-2"></i>종료일</span>
                    <span className="fw-bold">{formatDate(course.endDate)}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                    <span><i className="bi bi-people me-2"></i>정원</span>
                    <span className="fw-bold">{course.capacity}명</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                    <span><i className="bi bi-person-plus me-2"></i>잔여 자리</span>
                    <span className={`fw-bold ${course.capacity - course.currentEnrollment <= 5 ? 'text-danger' : 'text-success'}`}>
                      {course.capacity - course.currentEnrollment}명
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-grid">
                {getEnrollmentButton()}
              </div>

              {enrollmentStatus === 'pending' && (
                <div className="alert alert-info mt-3" role="alert">
                  <small>
                    수강 신청이 완료되었습니다. 관리자 승인을 기다려주세요.
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;