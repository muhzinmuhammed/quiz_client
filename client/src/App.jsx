import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import UserRegisterPage from './pages/Register/UserRegisterPage';
import UserLoginPage from './pages/Login/UserLogin';
import PrivateRoute from './components/private/Index';
import HomePage from './pages/Home/HomePage';
import NotFound from './components/404Page/Index';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDasBoardPage from './pages/Admin/AdminDashBoard';

function App() {

  return (
    <>
     <Provider store={store}>
     <Router>
<Routes>
<Route path="/register" element={<UserRegisterPage />} />
<Route path="/login" element={<UserLoginPage />} />
<Route path="/admin-login" element={<AdminLoginPage />} />
<Route path="/admin-home" element={<AdminDasBoardPage />} />

<Route path="*" element={<NotFound />} />
<Route element={<PrivateRoute />}>
<Route path="/" element={<HomePage />} />
</Route>
</Routes>
      </Router>
     </Provider>
    </>
  )
}

export default App
