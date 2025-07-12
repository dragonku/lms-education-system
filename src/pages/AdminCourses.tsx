import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseApi } from '../services/api';
import { Course, CourseStatus, UserType } from '../types';

const AdminCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    capacity: 0,
    startDate: '',
    endDate: '',
    duration: '',
    price: 0,
    status: CourseStatus.ACTIVE,
    imageUrl: ''
  });

  useEffect(() => {
    if (user?.userType === UserType.ADMIN) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const result = await courseApi.getCourses({ size: 100 });
      setCourses(result.courses);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCourse = await courseApi.createCourse(formData);
      setCourses([...courses, createdCourse]);
      setShowCreateForm(false);
      resetForm();
      alert('과정이 생성되었습니다.');
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('과정 생성 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    
    try {
      const updatedCourse = await courseApi.updateCourse(editingCourse.id, formData);
      setCourses(courses.map(c => c.id === editingCourse.id ? updatedCourse : c));
      setEditingCourse(null);
      resetForm();
      alert('과정이 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update course:', error);
      alert('과정 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('정말로 이 과정을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await courseApi.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      alert('과정이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('과정 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      capacity: course.capacity,
      startDate: course.startDate,
      endDate: course.endDate,
      duration: course.duration,
      price: course.price,
      status: course.status as CourseStatus,
      imageUrl: course.imageUrl || ''
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      category: '',
      capacity: 0,
      startDate: '',
      endDate: '',
      duration: '',
      price: 0,
      status: CourseStatus.ACTIVE,
      imageUrl: ''
    });
    setEditingCourse(null);
  };

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.ACTIVE:
        return <span className="badge bg-success"><i className="bi bi-play-circle me-1"></i>활성</span>;
      case CourseStatus.INACTIVE:
        return <span className="badge bg-secondary"><i className="bi bi-pause-circle me-1"></i>비활성</span>;
      case CourseStatus.FULL:
        return <span className="badge bg-warning"><i className="bi bi-people-fill me-1"></i>마감</span>;
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
              <i className="bi bi-book-half me-2"></i>
              과정 관리
            </h1>
            <div>
              <nav aria-label="breadcrumb" className="d-inline-block me-3">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><a href="/admin">관리자</a></li>
                  <li className="breadcrumb-item active">과정 관리</li>
                </ol>
              </nav>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                새 과정 추가
              </button>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-primary">{courses.length}</h4>
                  <p className="text-muted mb-0">전체 과정</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-success">{courses.filter(c => c.status === CourseStatus.ACTIVE).length}</h4>
                  <p className="text-muted mb-0">활성 과정</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-warning">{courses.filter(c => c.status === CourseStatus.FULL).length}</h4>
                  <p className="text-muted mb-0">마감 과정</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-info">{courses.reduce((sum, c) => sum + c.currentEnrollment, 0)}</h4>
                  <p className="text-muted mb-0">총 수강생</p>
                </div>
              </div>
            </div>
          </div>

          {/* 과정 생성/수정 폼 */}
          {showCreateForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  {editingCourse ? '과정 수정' : '새 과정 추가'}
                </h5>
                <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">과정명</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">강사</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.instructor}
                          onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">과정 설명</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">카테고리</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">정원</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">가격</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">시작일</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">종료일</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">기간</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          placeholder="예: 8주"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">상태</label>
                        <select
                          className="form-select"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as CourseStatus})}
                        >
                          <option value={CourseStatus.ACTIVE}>활성</option>
                          <option value={CourseStatus.INACTIVE}>비활성</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">이미지 URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-2"></i>
                      {editingCourse ? '수정' : '생성'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCreateForm(false);
                        resetForm();
                      }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      취소
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 과정 목록 */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>과정명</th>
                      <th>강사</th>
                      <th>카테고리</th>
                      <th>정원</th>
                      <th>수강생</th>
                      <th>기간</th>
                      <th>가격</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-book me-2"></i>
                            <div>
                              <div className="fw-bold">{course.title}</div>
                              <small className="text-muted">{course.description.substring(0, 50)}...</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <i className="bi bi-person me-2"></i>
                          {course.instructor}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {course.category}
                          </span>
                        </td>
                        <td>
                          <i className="bi bi-people me-2"></i>
                          {course.capacity}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{course.currentEnrollment}</span>
                            <div className="progress" style={{ width: '50px', height: '8px' }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${(course.currentEnrollment / course.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <i className="bi bi-calendar-range me-2"></i>
                          {course.duration}
                        </td>
                        <td>
                          <i className="bi bi-currency-dollar me-2"></i>
                          {formatPrice(course.price)}원
                        </td>
                        <td>{getStatusBadge(course.status as CourseStatus)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEditCourse(course)}
                              title="수정"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteCourse(course.id)}
                              title="삭제"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;