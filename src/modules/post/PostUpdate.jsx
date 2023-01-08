import 'react-quill/dist/quill.snow.css';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/button';
import { Radio } from '../../components/checkbox';
import { Dropdown } from '../../components/dropdown';
import { Field, FieldCheckboxes } from '../../components/field';
import ImageUpload from '../../components/image/ImageUpload';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import Toggle from '../../components/toggle/Toggle';
import { useAuth } from '../../contexts/auth-context';
import { db } from '../../firebase-app/firebase-config';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import { postStatus } from '../../utils/constants';
import DashboardHeading from '../dashboard/DashboardHeading';

const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const imageUrl = getValues("image");
  const imageName = getValues("image_name");
  const deletePostImage = async () => {
    const colRef = doc(db, "posts", postId);
    await updateDoc(colRef, {
      image: "",
    });
  };
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deletePostImage);

  useEffect(() => {
    const getData = async () => {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    };
    getData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;
      const docRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.data()) {
        reset(docSnapshot.data());
        setSelectCategory(docSnapshot.data().category);
      }
    }
    fetchData();
  }, [postId, reset]);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
  };

  const updatePostHandler = async (values) => {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, {
      content,
    });
    toast.success("Updated successfully!");
  };

  if (!postId) return null;

  return (
    <>
      <DashboardHeading title="Update post" desc="Update post content" />
      <form onSubmit={handleSubmit(updatePostHandler)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            />
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
              progress={progress}
              image={image}
            />
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 text-sm font-medium text-green-600 bg-green-100 rounded-lg">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill theme="snow" value={content} onChange={setContent} />
            </div>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            />
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disabled={loading}
        >
          Update post
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
