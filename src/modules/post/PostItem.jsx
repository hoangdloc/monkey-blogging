import React from 'react';
import slugify from 'slugify';
import styled from 'styled-components';

import PostCategory from './PostCategory';
import PostImage from './PostImage';
import PostMeta from './PostMeta';
import PostTitle from './PostTitle';

const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;

const PostItem = ({ data }) => {
  if (!data) return null;

  const date = new Date(data?.createdAt?.seconds * 1000);
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostItemStyles>
      <PostImage url={data.image} alt="Cover of post" to={data.slug} />
      <PostCategory to={data.category.slug}>{data.category.name}</PostCategory>
      <PostTitle to={data.slug}>{data.title}</PostTitle>
      <PostMeta
        to={slugify(data.user.username || "", { lower: true })}
        authorName={data.user.fullname}
        date={formatDate}
      />
    </PostItemStyles>
  );
};

export default PostItem;
