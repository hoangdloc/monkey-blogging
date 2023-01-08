import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where
} from 'firebase/firestore';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { ActionDelete, ActionEdit, ActionView } from '../../components/action';
import { Button } from '../../components/button';
import { Dropdown } from '../../components/dropdown';
import { LabelStatus } from '../../components/label';
import { Table } from '../../components/table';
import { db } from '../../firebase-app/firebase-config';
import { postStatus } from '../../utils/constants';
import DashboardHeading from '../dashboard/DashboardHeading';

const POST_PER_PAGE = 5;

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
          )
        : query(colRef, limit(POST_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(results);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  const handleSearchPost = debounce((e) => {
    setFilter(e.target.value);
  }, 250);

  const handleDeletePost = async (postId) => {
    const docRef = doc(db, "posts", postId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(docRef);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };

  const handleLoadMorePosts = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(lastDoc),
      limit(POST_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList([...postList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };

  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Approved</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case postStatus.REJECTED:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        break;
    }
  };

  return (
    <div>
      <DashboardHeading title="All posts" desc="Manage all posts" />
      <div className="flex justify-end gap-5 mb-10">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Dropdown.Select placeholder="Category" />
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 border-solid rounded-lg"
            placeholder="Search post..."
            onChange={handleSearchPost}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((post) => (
              <tr key={post.id}>
                <td title={post.id}>{post.id.slice(0, 5) + "..."}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={post.image}
                      alt="Post item"
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3
                        className="font-semibold max-w-[300px] whitespace-pre-wrap"
                        title={post.title}
                      >
                        {post.title}
                      </h3>
                      <time className="text-sm text-gray-500">
                        Date:{" "}
                        {new Date(
                          post.createdAt.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{post.category.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{post.user.username}</span>
                </td>
                <td>{renderPostStatus(post.status)}</td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ActionView onClick={() => navigate(`/${post.slug}`)} />
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${post.id}`)
                      }
                    />
                    <ActionDelete onClick={() => handleDeletePost(post.id)} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > postList.length && (
        <div className="mt-10 text-center">
          <Button
            onClick={handleLoadMorePosts}
            kind="ghost"
            className="mx-auto w-[200px]"
          >
            Load more+
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostManage;
