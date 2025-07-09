import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
  background-color: ${props => {
    switch (props.status) {
      case 'ACTIVE': return '#27ae60';
      case 'PENDING': return '#f39c12';
      case 'REJECTED': return '#e74c3c';
      case 'SUSPENDED': return '#95a5a6';
      default: return '#95a5a6';
    }
  }};
`;

const InfoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
`;

const CardContent = styled.div`
  color: #7f8c8d;
  line-height: 1.6;
`;

const UserInfo = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UserInfoTitle = styled.h2`
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  strong {
    min-width: 120px;
    color: #2c3e50;
  }
  
  span {
    color: #7f8c8d;
  }
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'ADMIN': return '관리자';
      case 'COMPANY': return '협약사';
      case 'EMPLOYEE': return '재직자';
      case 'JOB_SEEKER': return '구직자';
      default: return userType;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '활성';
      case 'PENDING': return '승인 대기';
      case 'REJECTED': return '승인 거부';
      case 'SUSPENDED': return '정지';
      default: return status;
    }
  };

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>안녕하세요, {user.name}님!</WelcomeTitle>
        <WelcomeSubtitle>
          {getUserTypeLabel(user.userType)}로 로그인하셨습니다.
        </WelcomeSubtitle>
        <StatusBadge status={user.status}>
          {getStatusLabel(user.status)}
        </StatusBadge>
      </WelcomeSection>

      <InfoCards>
        <InfoCard>
          <CardTitle>🎯 Release 1 완료</CardTitle>
          <CardContent>
            기본 설정 및 사용자 인증 기능이 구현되었습니다.
            <ul>
              <li>회원가입 및 로그인</li>
              <li>사용자 유형별 관리</li>
              <li>JWT 기반 인증</li>
              <li>권한 기반 접근 제어</li>
            </ul>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardTitle>🚀 다음 단계</CardTitle>
          <CardContent>
            Release 2에서는 교육 과정 관리 기능이 추가될 예정입니다.
            <ul>
              <li>과정 등록 및 관리</li>
              <li>수강 신청</li>
              <li>마이페이지</li>
              <li>과정 상세 정보</li>
            </ul>
          </CardContent>
        </InfoCard>
      </InfoCards>

      <UserInfo>
        <UserInfoTitle>내 정보</UserInfoTitle>
        <InfoRow>
          <strong>이메일:</strong>
          <span>{user.email}</span>
        </InfoRow>
        <InfoRow>
          <strong>이름:</strong>
          <span>{user.name}</span>
        </InfoRow>
        <InfoRow>
          <strong>연락처:</strong>
          <span>{user.phoneNumber}</span>
        </InfoRow>
        <InfoRow>
          <strong>사용자 유형:</strong>
          <span>{getUserTypeLabel(user.userType)}</span>
        </InfoRow>
        <InfoRow>
          <strong>상태:</strong>
          <span>{getStatusLabel(user.status)}</span>
        </InfoRow>
        {user.companyName && (
          <InfoRow>
            <strong>회사명:</strong>
            <span>{user.companyName}</span>
          </InfoRow>
        )}
        <InfoRow>
          <strong>가입일:</strong>
          <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '정보 없음'}</span>
        </InfoRow>
      </UserInfo>
    </DashboardContainer>
  );
};

export default Dashboard;