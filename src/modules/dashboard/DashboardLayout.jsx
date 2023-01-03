import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../../contexts/auth-context';
import NotFoundPage from '../../pages/NotFoundPage';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';

const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 40px;
      color: ${(props) => props.theme.primary};
      letter-spacing: 1px;
    }
    &-main {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      padding: 40px 20px;
      gap: 0 40px;
      align-items: start;
    }
    @media screen and (max-width: 1023.98px) {
      &-heading {
        font-size: 20px;
      }
      &-short-desc {
        margin-bottom: 25px;
      }
      &-main {
        grid-template-columns: 100%;
        padding: 20px;
      }
    }
  }
`;

const DashboardLayout = ({ children }) => {
  const { userInfo } = useAuth();
  if (!userInfo) return <NotFoundPage></NotFoundPage>;

  return (
    <DashboardStyles>
      <DashboardHeader />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-children">
          <Outlet />
        </div>
      </div>
    </DashboardStyles>
  );
};

export default DashboardLayout;
