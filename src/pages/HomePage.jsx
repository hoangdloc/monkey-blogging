import React, { useEffect } from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/Layout';
import HomeBanner from '../modules/home/HomeBanner';
import HomeFeature from '../modules/home/HomeFeature';
import HomeNewest from '../modules/home/HomeNewest';

const HomePageStyles = styled.div``;

const HomePage = () => {
  useEffect(() => {
    document.title = "Home Page";
  }, []);

  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner />
        <HomeFeature />
        <HomeNewest />
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
