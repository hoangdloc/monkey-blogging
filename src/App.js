import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/auth-context';
import DashboardLayout from './modules/dashboard/DashboardLayout';
import PostAddNew from './modules/post/PostAddNew';
import PostManage from './modules/post/PostManage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import PostDetailsPage from './pages/PostDetailsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />

          <Route path="*" element={<PageNotFound />} />
          <Route path="/:slug" element={<PostDetailsPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/manage/post" element={<PostManage />} />
            <Route path="/manage/add-post" element={<PostAddNew />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
