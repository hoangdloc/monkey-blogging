import React from 'react';
import slugify from 'slugify';
import styled from 'styled-components';

import PostCategory from './PostCategory';
import PostImage from './PostImage';
import PostMeta from './PostMeta';
import PostTitle from './PostTitle';

const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 20px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 20px;
    }
    @media screen and (max-width: 1023.98px) {
      &-image {
        height: 250px;
      }
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data.id) return null;

  const date = new Date(data?.createdAt?.seconds * 1000);
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostNewestLargeStyles>
      <PostImage url={data.image} alt="unsplash" to={data.slug} />
      <PostCategory to={data.category.slug}>{data.category.name}</PostCategory>
      <PostTitle to={data.slug} size="big">
        {data.title}
      </PostTitle>
      <PostMeta
        to={slugify(data.user.username || "", { lower: true })}
        authorName={data.user.fullname}
        date={formatDate}
      />
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
