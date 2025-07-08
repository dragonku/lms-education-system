import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Course } from '../types';
import { courseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CoursesContainer = styled.div`
  padding: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
`;

const CreateButton = styled(Link)`
  background-color: #27ae60;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #219a52;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 250px;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CourseHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
`;

const CourseTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const CourseType = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const CourseBody = styled.div`
  padding: 1.5rem;
`;

const CourseDescription = styled.p`
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CourseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #95a5a6;
`;

const CourseFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseLink = styled(Link)`
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: ${props => 
    props.status === 'published' ? '#27ae60' :
    props.status === 'draft' ? '#f39c12' : '#95a5a6'
  };
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#ecf0f1'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });
  
  const { user } = useAuth();
  const coursesPerPage = 6;


  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const result = await courseApi.getCourses(currentPage, coursesPerPage);
        setCourses(result.courses);
        setTotalPages(Math.ceil(result.total / coursesPerPage));
      } catch (err: any) {
        setError('강좌 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [currentPage]);

  const filteredCourses = courses.filter(course => {
    if (filters.type && course.courseType !== filters.type) return false;
    if (filters.status && course.status !== filters.status) return false;
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'employee_training': return '재직자 교육';
      case 'job_seeker_training': return '구직자 양성과정';
      case 'general': return '일반 교육';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return '개설';
      case 'draft': return '준비중';
      case 'archived': return '종료';
      default: return status;
    }
  };

  if (loading) {
    return <LoadingMessage>강좌 목록을 불러오는 중...</LoadingMessage>;
  }

  return (
    <CoursesContainer>
      <Header>
        <Title>강좌 목록</Title>
        {user?.userType === 'admin' && (
          <CreateButton to="/courses/create">새 강좌 만들기</CreateButton>
        )}
      </Header>

      <Filters>
        <Select
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">모든 유형</option>
          <option value="employee_training">재직자 교육</option>
          <option value="job_seeker_training">구직자 양성과정</option>
          <option value="general">일반 교육</option>
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">모든 상태</option>
          <option value="published">개설</option>
          <option value="draft">준비중</option>
          <option value="archived">종료</option>
        </Select>

        <SearchInput
          type="text"
          placeholder="강좌명으로 검색..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
      </Filters>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CourseGrid>
        {filteredCourses.map((course) => (
          <CourseCard key={course.id}>
            <CourseHeader>
              <CourseTitle>{course.title}</CourseTitle>
              <CourseType>{getTypeLabel(course.courseType)}</CourseType>
            </CourseHeader>
            <CourseBody>
              <CourseDescription>{course.description}</CourseDescription>
              <CourseInfo>
                <span>수강인원: {course.minStudents}-{course.maxStudents}명</span>
                <span>교육시간: {course.duration}시간</span>
              </CourseInfo>
              <CourseFooter>
                <StatusBadge status={course.status}>
                  {getStatusLabel(course.status)}
                </StatusBadge>
                <CourseLink to={`/courses/${course.id}`}>자세히 보기</CourseLink>
              </CourseFooter>
            </CourseBody>
          </CourseCard>
        ))}
      </CourseGrid>

      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </PageButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            다음
          </PageButton>
        </Pagination>
      )}
    </CoursesContainer>
  );
};

export default Courses;