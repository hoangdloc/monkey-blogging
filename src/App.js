import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/auth-context';

const HomePage = React.lazy(async () => await import("./pages/HomePage"));
const SignUpPage = React.lazy(async () => await import("./pages/SignUpPage"));
const SignInPage = React.lazy(async () => await import("./pages/SignInPage"));
const PostDetailsPage = React.lazy(
  async () => await import("./pages/PostDetailsPage")
);
const PageNotFound = React.lazy(
  async () => await import("./pages/PageNotFound")
);
const DashboardPage = React.lazy(
  async () => await import("./pages/DashboardPage")
);
const CategoryPage = React.lazy(
  async () => await import("./pages/CategoryPage")
);
const UserUpdate = React.lazy(
  async () => await import("./modules/user/UserUpdate")
);
const UserProfile = React.lazy(
  async () => await import("./modules/user/UserProfile")
);
const UserManage = React.lazy(
  async () => await import("./modules/user/UserManage")
);
const UserAddNew = React.lazy(
  async () => await import("./modules/user/UserAddNew")
);
const PostUpdate = React.lazy(
  async () => await import("./modules/post/PostUpdate")
);
const PostManage = React.lazy(
  async () => await import("./modules/post/PostManage")
);
const PostAddNew = React.lazy(
  async () => await import("./modules/post/PostAddNew")
);
const DashboardLayout = React.lazy(
  async () => await import("./modules/dashboard/DashboardLayout")
);
const CategoryUpdate = React.lazy(
  async () => await import("./modules/category/CategoryUpdate")
);
const CategoryManage = React.lazy(
  async () => await import("./modules/category/CategoryManage")
);
const CategoryAddNew = React.lazy(
  async () => await import("./modules/category/CategoryAddNew")
);

function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/:slug" element={<PostDetailsPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manage/posts" element={<PostManage />} />
              <Route path="/manage/add-post" element={<PostAddNew />} />
              <Route path="/manage/update-post" element={<PostUpdate />} />
              <Route path="/manage/category" element={<CategoryManage />} />
              <Route path="/manage/add-category" element={<CategoryAddNew />} />
              <Route
                path="/manage/update-category"
                element={<CategoryUpdate />}
              />
              <Route path="/manage/user" element={<UserManage />} />
              <Route path="/manage/add-user" element={<UserAddNew />} />
              <Route path="/manage/update-user" element={<UserUpdate />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
