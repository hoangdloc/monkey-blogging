import {
  collection,
  limit,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Heading from '../../components/layout/Heading';
import { db } from '../../firebase-app/firebase-config';
import PostItem from '../post/PostItem';
import PostNewestItem from '../post/PostNewestItem';
import PostNewestLarge from '../post/PostNewestLarge';

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 40px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(colRef, where("status", "==", 1), limit(4));
    onSnapshot(queries, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
    });
  }, []);

  if (posts.length <= 0) return null;
  const [first, ...others] = posts;

  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Latest posts</Heading>
        <div className="layout">
          <PostNewestLarge data={first} />
          <div className="sidebar">
            {others.length > 0 &&
              others.map((item) => (
                <PostNewestItem key={item.id} data={item} />
              ))}
          </div>
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
