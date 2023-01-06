import { yupResolver } from '@hookform/resolvers/yup';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { Button } from '../../components/button';
import { Radio } from '../../components/checkbox';
import { Field, FieldCheckboxes } from '../../components/field';
import ImageUpload from '../../components/image/ImageUpload';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { db } from '../../firebase-app/firebase-config';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import { userRole, userStatus } from '../../utils/constants';
import DashboardHeading from '../dashboard/DashboardHeading';

const schema = yup.object({
  avatar: yup.string(),
  fullname: yup.string().required("Please enter fullname!"),
  email: yup
    .string()
    .email("Please enter valid email address!")
    .required("Please enter email address!"),
  username: yup.string(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters or greater!")
    .required("Please enter password!"),
  status: yup
    .number()
    .required("Please select user status!")
    .oneOf([userStatus.ACTIVE, userStatus.PENDING, userStatus.BAN]),
  role: yup
    .number()
    .required("Please select user role!")
    .oneOf([userRole.ADMIN, userRole.MOD, userRole.USER]),
});

const UserUpdate = () => {
  const [params] = useSearchParams();
  const userId = params.get("id");
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const watchStatus = watch("status");
  const watchRole = watch("role");
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex != null ? imageRegex[1] : "";
  const deleteAvatar = async () => {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  };
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message);
    }
  }, [errors]);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);
      const docData = await getDoc(colRef);
      reset(docData && docData.data());
    }

    fetchData();
  }, [reset, userId]);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  if (!userId) return;

  const handleUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        avatar: image,
      });
      toast.success("Updated user information successfully");
    } catch (error) {
      console.log(error);
      toast.error("Update user failed!");
    }
  };

  return (
    <div>
      <DashboardHeading title="Update user" desc="Update user information" />
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            className="!rounded-full h-full"
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
          />
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            />
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                checked={Number(watchStatus) === userStatus.ACTIVE}
                control={control}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                checked={Number(watchStatus) === userStatus.PENDING}
                control={control}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                checked={Number(watchStatus) === userStatus.BAN}
                control={control}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update user
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
