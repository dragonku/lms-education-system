import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../services/api';
import { Course } from '../types';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 6;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, searchTerm, currentPage]);

  const fetchCategories = async () => {
    try {
      const categoryList = await courseApi.getCategories();
      setCategories(categoryList);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await courseApi.getCourses({
        page: currentPage,
        size: pageSize,
        category: selectedCategory || undefined,
        search: searchTerm || undefined
      });
      
      setCourses(result.courses);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (err: any) {
      setError(err.response?.data?.message || '과정 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">과정 목록</h1>
          
          {/* 필터 및 검색 */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-funnel"></i></span>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">전체 카테고리</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="과정명, 설명, 강사명으로 검색..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* 과정 목록 */}
          <div className="row">
            {courses.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  검색 조건에 맞는 과정이 없습니다.
                </div>
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="position-relative" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          className="card-img-top"
                          alt={course.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="d-flex align-items-center justify-content-center h-100"
                        style={{ display: course.imageUrl ? 'none' : 'flex' }}
                      >
                        <div className="text-center text-muted">
                          <i className="bi bi-book" style={{ fontSize: '3rem' }}></i>
                          <div className="mt-2">
                            <small>{course.category}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{course.title}</h5>
                        {getStatusBadge(course)}
                      </div>
                      
                      <div className="mb-2">
                        <span className="badge bg-light text-dark me-2">
                          <i className="bi bi-bookmark me-1"></i>{course.category}
                        </span>
                        <span className="text-muted small">
                          <i className="bi bi-person me-1"></i>{course.instructor}
                        </span>
                      </div>
                      
                      <p className="card-text flex-grow-1">
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...` 
                          : course.description}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="row small mb-2">
                          <div className="col-6">
                            <i className="bi bi-clock me-1"></i><strong>기간:</strong> {course.duration}
                          </div>
                          <div className="col-6">
                            <i className="bi bi-people me-1"></i><strong>정원:</strong> {course.currentEnrollment}/{course.capacity}
                          </div>
                        </div>
                        
                        <div className="row small mb-3">
                          <div className="col-6">
                            <i className="bi bi-calendar-event me-1"></i><strong>시작:</strong> {formatDate(course.startDate)}
                          </div>
                          <div className="col-6">
                            <i className="bi bi-currency-dollar me-1"></i><strong>가격:</strong> {formatPrice(course.price)}원
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="d-flex justify-content-between align-items-center small mb-1">
                            <span>수강률</span>
                            <span>{Math.round((course.currentEnrollment / course.capacity) * 100)}%</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${(course.currentEnrollment / course.capacity) * 100}%` }}
                              aria-valuenow={course.currentEnrollment}
                              aria-valuemin={0}
                              aria-valuemax={course.capacity}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <Link
                            to={`/courses/${course.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i>상세보기
                          </Link>
                          
                          <span className="text-muted small">
                            {course.capacity - course.currentEnrollment > 0 ? (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                {course.capacity - course.currentEnrollment}자리 남음
                              </span>
                            ) : (
                              <span className="text-danger">
                                <i className="bi bi-x-circle me-1"></i>마감
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;