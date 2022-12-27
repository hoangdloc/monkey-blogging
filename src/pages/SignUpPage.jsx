import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { Button } from '../components/button';
import { Field } from '../components/field';
import { Input } from '../components/input';
import InputPasswordToggle from '../components/input/InputPasswordToggle';
import { Label } from '../components/label';
import { auth, db } from '../firebase-app/firebase-config';
import AuthenticationPage from './AuthenticationPage';

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname!"),
  email: yup
    .string()
    .email("Please enter valid email address!")
    .required("Please enter your email address!"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater!")
    .required("Please enter your password!"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  useEffect(() => {
    document.title = "Register Page";
  }, []);

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message);
    }
  }, [errors]);

  const handleSignUp = async (values) => {
    if (!isValid) return;
    await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
    });
    const colRef = collection(db, "users");
    await addDoc(colRef, {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
    });
    toast.success("Registered successfully 😀");
    navigate("/");
  };

  return (
    <AuthenticationPage>
      <form
        className="form"
        autoComplete="off"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <Field>
          <Label htmlFor="fullname">Fullname</Label>
          <Input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            control={control}
          />
        </Field>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email address"
            control={control}
          />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPasswordToggle control={control} />
        </Field>
        <div className="have-account">
          Already have an account? <Link to={"/sign-in"}>Login</Link>
        </div>
        <Button
          type="submit"
          style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
