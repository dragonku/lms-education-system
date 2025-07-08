import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Course } from '../types';
import { courseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const CourseHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const CourseTitle = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const CourseTypeInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TypeBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'published' ? '#27ae60' :
    props.status === 'draft' ? '#f39c12' : '#95a5a6'
  };
`;

const CourseDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
`;

const ContentSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
`;

const ObjectivesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ObjectiveItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid #ecf0f1;
  
  &:before {
    content: "✓";
    color: #27ae60;
    font-weight: bold;
    margin-right: 0.75rem;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #3498db;
          color: white;
          &:hover { background-color: #2980b9; }
        `;
      case 'secondary':
        return `
          background-color: #95a5a6;
          color: white;
          &:hover { background-color: #7f8c8d; }
        `;
      case 'danger':
        return `
          background-color: #e74c3c;
          color: white;
          &:hover { background-color: #c0392b; }
        `;
      default:
        return `
          background-color: #ecf0f1;
          color: #2c3e50;
          &:hover { background-color: #bdc3c7; }
        `;
    }
  }}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  text-align: center;
`;

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const courseData = await courseApi.getCourse(id);
        setCourse(courseData);
      } catch (err: any) {
        setError('강좌 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

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

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // 수강 신청 로직 구현
    alert('수강 신청 기능은 곧 추가될 예정입니다.');
  };

  const handleEdit = () => {
    navigate(`/courses/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('정말로 이 강좌를 삭제하시겠습니까?')) return;
    
    try {
      await courseApi.deleteCourse(id);
      alert('강좌가 삭제되었습니다.');
      navigate('/courses');
    } catch (err) {
      alert('강좌 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <LoadingMessage>강좌 정보를 불러오는 중...</LoadingMessage>;
  }

  if (error) {
    return (
      <DetailContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </DetailContainer>
    );
  }

  if (!course) {
    return (
      <DetailContainer>
        <ErrorMessage>강좌를 찾을 수 없습니다.</ErrorMessage>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <CourseHeader>
        <CourseTypeInfo>
          <TypeBadge>{getTypeLabel(course.courseType)}</TypeBadge>
          <StatusBadge status={course.status}>
            {getStatusLabel(course.status)}
          </StatusBadge>
        </CourseTypeInfo>
        <CourseTitle>{course.title}</CourseTitle>
        <CourseDescription>{course.description}</CourseDescription>
      </CourseHeader>

      <ContentSection>
        <SectionTitle>강좌 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>교육 시간</InfoLabel>
            <InfoValue>{course.duration}시간</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>수강 인원</InfoLabel>
            <InfoValue>{course.minStudents}-{course.maxStudents}명</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>카테고리</InfoLabel>
            <InfoValue>{course.category}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>대상</InfoLabel>
            <InfoValue>{course.targetAudience}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </ContentSection>

      <ContentSection>
        <SectionTitle>학습 목표</SectionTitle>
        <ObjectivesList>
          {course.objectives.map((objective, index) => (
            <ObjectiveItem key={index}>{objective}</ObjectiveItem>
          ))}
        </ObjectivesList>
      </ContentSection>

      {course.prerequisites && course.prerequisites.length > 0 && (
        <ContentSection>
          <SectionTitle>수강 요건</SectionTitle>
          <ObjectivesList>
            {course.prerequisites.map((prerequisite, index) => (
              <ObjectiveItem key={index}>{prerequisite}</ObjectiveItem>
            ))}
          </ObjectivesList>
        </ContentSection>
      )}

      <ContentSection>
        <SectionTitle>태그</SectionTitle>
        <TagContainer>
          {course.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagContainer>
      </ContentSection>

      <ActionButtons>
        {user?.userType === 'student' && course.status === 'published' && (
          <Button variant="primary" onClick={handleEnroll}>
            수강 신청
          </Button>
        )}
        
        {user?.userType === 'admin' && (
          <>
            <Button variant="secondary" onClick={handleEdit}>
              수정
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </>
        )}
        
        <Button onClick={() => navigate('/courses')}>
          목록으로 돌아가기
        </Button>
      </ActionButtons>
    </DetailContainer>
  );
};

export default CourseDetail;