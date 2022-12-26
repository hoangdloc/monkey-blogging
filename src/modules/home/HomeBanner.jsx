import React from 'react';
import styled from 'styled-components';

import { Button } from '../../components/button';

const HomeBannerStyles = styled.div`
  height: 520px;
  padding: 40px 0;
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  margin-bottom: 60px;
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      max-width: 600px;
      color: white;
    }
    &-heading {
      font-size: 36px;
      margin-bottom: 20px;
    }
    &-description {
      line-height: 1.75;
      margin-bottom: 40px;
    }
  }
`;

const HomeBanner = () => {
  return (
    <HomeBannerStyles>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heading">Monkey Blogging</h1>
            <p className="banner-description">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae
              impedit dolor dolore est numquam molestias quam nostrum quod
              perspiciatis? Minus praesentium quibusdam neque deserunt obcaecati
              non illum, eaque dicta sint?
            </p>
            <Button kind="secondary" to="/sign-up">
              Get started
            </Button>
          </div>
          <div className="banner-image">
            <img src="/img-banner.png" alt="Banner" />
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
