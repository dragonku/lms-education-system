import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Footer = styled.footer`
  background-color: #34495e;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  margin-top: auto;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer>
        <p>&copy; 2024 LMS 교육관리시스템. All rights reserved.</p>
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;