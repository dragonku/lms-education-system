import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { UserType } from '../../types';

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


  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">LMS 교육관리시스템</Logo>
        
        <Nav>
          <NavLink to="/courses">과정 목록</NavLink>
          <NavLink to="/board/notice">공지사항</NavLink>
          <NavLink to="/qna">Q&A</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">대시보드</NavLink>
              {user?.userType === UserType.ADMIN && (
                <NavLink to="/admin">관리자</NavLink>
              )}
              <UserInfo>
                <NavLink to="/mypage" style={{ color: 'white', textDecoration: 'none' }}>
                  <UserName>{user?.name}님</UserName>
                </NavLink>
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