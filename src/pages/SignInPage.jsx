import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
import { useAuth } from '../contexts/auth-context';
import { auth } from '../firebase-app/firebase-config';
import AuthenticationPage from './AuthenticationPage';

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address!")
    .required("Please enter your email address!"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater!")
    .required("Please enter your password!"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  useEffect(() => {
    document.title = "Login Page";
    if (userInfo?.accessToken) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message);
    }
  }, [errors]);

  const handleSignIn = async (values) => {
    if (!isValid) return;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    navigate("/");
  };

  return (
    <AuthenticationPage>
      <form
        className="form"
        autoComplete="off"
        onSubmit={handleSubmit(handleSignIn)}
      >
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
          You haven't an account yet? <Link to={"/sign-up"}>Register now</Link>
        </div>
        <Button
          type="submit"
          style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
