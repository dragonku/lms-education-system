import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: #f39c12;
  color: white;
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const FeatureTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const Stats = styled.section`
  background: #ecf0f1;
  padding: 3rem 2rem;
  border-radius: 8px;
  margin: 3rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-weight: 500;
`;

const WelcomeMessage = styled.div`
  background: #d5f4e6;
  border: 1px solid #27ae60;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #27ae60;
`;

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <HomeContainer>
      {isAuthenticated && (
        <WelcomeMessage>
          환영합니다, {user?.name}님! 
          {user?.status === 'pending_approval' && ' (계정 승인 대기 중)'}
        </WelcomeMessage>
      )}
      
      <Hero>
        <HeroTitle>LMS 교육관리시스템</HeroTitle>
        <HeroSubtitle>
          체계적이고 효율적인 교육 관리를 위한 통합 플랫폼
        </HeroSubtitle>
        {!isAuthenticated ? (
          <CTAButton to="/register">지금 시작하기</CTAButton>
        ) : (
          <CTAButton to="/courses">강좌 둘러보기</CTAButton>
        )}
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureTitle>🎓 다양한 교육과정</FeatureTitle>
          <FeatureDescription>
            재직자 교육, 구직자 양성과정, 일반 교육 등 
            다양한 유형의 교육과정을 제공합니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>👥 체계적인 사용자 관리</FeatureTitle>
          <FeatureDescription>
            관리자, 강사, 교육생, 기업 담당자별로 
            차별화된 기능과 권한을 제공합니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>📊 평가 및 진도 관리</FeatureTitle>
          <FeatureDescription>
            온라인 시험, 과제 제출, 출석 관리 등
            체계적인 학습 평가 시스템을 제공합니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>🏢 기업 맞춤 교육</FeatureTitle>
          <FeatureDescription>
            협약 기업을 위한 맞춤형 교육과정과
            전담 관리 서비스를 제공합니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>💬 소통과 지원</FeatureTitle>
          <FeatureDescription>
            공지사항, Q&A, FAQ 게시판을 통한
            원활한 소통과 학습 지원을 제공합니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>📱 모바일 지원</FeatureTitle>
          <FeatureDescription>
            PC, 모바일, 태블릿 등 다양한 기기에서
            언제 어디서나 학습할 수 있습니다.
          </FeatureDescription>
        </FeatureCard>
      </Features>

      <Stats>
        <h2 style={{ marginBottom: '2rem', color: '#2c3e50' }}>LMS 현황</h2>
        <StatsGrid>
          <StatItem>
            <StatNumber>1,200+</StatNumber>
            <StatLabel>등록 회원</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>150+</StatNumber>
            <StatLabel>개설 강좌</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>협약 기업</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>95%</StatNumber>
            <StatLabel>수료 만족도</StatLabel>
          </StatItem>
        </StatsGrid>
      </Stats>
    </HomeContainer>
  );
};

export default Home;