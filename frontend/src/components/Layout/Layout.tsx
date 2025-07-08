import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

export default Layout;