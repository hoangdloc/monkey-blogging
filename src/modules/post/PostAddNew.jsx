import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import slugify from 'slugify';
import styled from 'styled-components';

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

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      hot: false,
      image: "",
      category: {},
      user: {},
    },
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues);

  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.email) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
  }, [setValue, userInfo.email]);

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
    document.title = "Monkey Blogging - Add new post";
  }, []);

  const addPostHandler = async (values) => {
    setLoading(true);
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(cloneValues.slug || cloneValues.title, {
        lower: true,
      });
      cloneValues.status = Number(cloneValues.status);

      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        image,
        createdAt: serverTimestamp(),
      });
      reset({
        title: "",
        slug: "",
        status: 2,
        category: {},
        hot: false,
        image: "",
        user: {},
      });
      handleResetUpload();
      setSelectCategory(null);
      toast.success("Created successfully 😀");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item.name);
  };

  return (
    <PostAddNewStyles>
      <DashboardHeading title="Add post" desc="Add new post" />
      <form onSubmit={handleSubmit(addPostHandler)}>
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
            {selectCategory && (
              <span className="inline-block p-3 text-sm font-medium text-green-600 bg-green-100 rounded-lg">
                {selectCategory}
              </span>
            )}
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
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
