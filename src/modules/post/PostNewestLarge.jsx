import React from 'react';
import styled from 'styled-components';

import PostCategory from './PostCategory';
import PostImage from './PostImage';
import PostMeta from './PostMeta';
import PostTitle from './PostTitle';

const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 10px;
    }
  }
`;

const PostNewestLarge = () => {
  return (
    <PostNewestLargeStyles>
      <PostImage
        url="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2662&q=80"
        alt="unsplash"
      />
      <PostCategory>Kiến thức</PostCategory>
      <PostTitle size="big">
        Hướng dẫn setup phòng cực chill dành cho người mới toàn tập
      </PostTitle>
      <PostMeta />
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
