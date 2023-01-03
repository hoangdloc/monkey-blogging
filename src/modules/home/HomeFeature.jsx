import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Heading from '../../components/layout/Heading';
import { db } from '../../firebase-app/firebase-config';
import PostFeatureItem from '../post/PostFeatureItem';

const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("hot", "==", true),
      limit(3)
    );
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

  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Featured posts</Heading>
        <div className="grid-layout">
          {posts.map((post) => (
            <PostFeatureItem key={post.id} data={post} />
          ))}
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
