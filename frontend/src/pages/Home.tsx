import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  text-align: center;
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

const WelcomeMessage = styled.div`
  background: #d5f4e6;
  border: 1px solid #27ae60;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #27ae60;
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

const ReleaseInfo = styled.div`
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const ReleaseTitle = styled.h3`
  color: #1976d2;
  margin-bottom: 0.5rem;
`;

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <HomeContainer>
      {isAuthenticated && (
        <WelcomeMessage>
          환영합니다, {user?.name}님! 
          {user?.status === 'PENDING' && ' (관리자 승인 대기 중)'}
        </WelcomeMessage>
      )}
      
      <Hero>
        <HeroTitle>LMS 교육관리시스템</HeroTitle>
        <HeroSubtitle>
          체계적이고 효율적인 교육 관리를 위한 통합 플랫폼
        </HeroSubtitle>
        
        {!isAuthenticated ? (
          <CTAButton to="/signup">지금 시작하기</CTAButton>
        ) : (
          <CTAButton to="/dashboard">대시보드로 이동</CTAButton>
        )}
      </Hero>

      <ReleaseInfo>
        <ReleaseTitle>🚀 Release 1 - 기본 설정 및 사용자 인증</ReleaseTitle>
        <p>현재 Release 1이 구현되었습니다:</p>
        <ul>
          <li>✅ 사용자 회원가입 (재직자/구직자/협약사)</li>
          <li>✅ JWT 기반 로그인/로그아웃</li>
          <li>✅ 권한 기반 접근 제어</li>
          <li>✅ Spring Boot 백엔드 + React 프론트엔드</li>
        </ul>
      </ReleaseInfo>

      <Features>
        <FeatureCard>
          <FeatureTitle>👤 사용자 관리</FeatureTitle>
          <FeatureDescription>
            재직자, 구직자, 협약사별 차별화된 회원가입과 
            관리자 승인 시스템을 제공합니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>🔐 보안 인증</FeatureTitle>
          <FeatureDescription>
            JWT 토큰 기반의 안전한 인증 시스템과 
            권한별 접근 제어를 구현했습니다.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>🏗️ Clean Architecture</FeatureTitle>
          <FeatureDescription>
            확장 가능한 Clean Architecture와 
            TDD 기반의 견고한 시스템을 구축했습니다.
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </HomeContainer>
  );
};

export default Home;