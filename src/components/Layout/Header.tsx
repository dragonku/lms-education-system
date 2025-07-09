import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const UserBadge = styled.span<{ userType: string }>`
  background-color: ${props => {
    switch (props.userType) {
      case 'ADMIN': return '#e74c3c';
      case 'COMPANY': return '#f39c12';
      case 'EMPLOYEE': return '#27ae60';
      case 'JOB_SEEKER': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: white;
    color: #2c3e50;
  }
`;

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'ADMIN': return '관리자';
      case 'COMPANY': return '협약사';
      case 'EMPLOYEE': return '재직자';
      case 'JOB_SEEKER': return '구직자';
      default: return userType;
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">LMS 교육관리시스템</Logo>
        
        <Nav>
          <NavLink to="/courses">과정 목록</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">대시보드</NavLink>
              <NavLink to="/mypage">마이페이지</NavLink>
              {user?.userType === 'ADMIN' && (
                <NavLink to="/admin">관리자</NavLink>
              )}
              <UserInfo>
                <UserName>{user?.name}님</UserName>
                <UserBadge userType={user?.userType || ''}>
                  {getUserTypeLabel(user?.userType || '')}
                </UserBadge>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
              </UserInfo>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;