import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import MainLayout from '../components/MainLayout';
import SignIn from '../components/Oauth2/Login';
import Dashboard from '../components/Dashboard/Dashboard';
import GestionUser from '../components/GestionUser/GestionUser';
import GestionAgent from '../components/GestionAgent/GestionAgent';

import { setUser } from '../redux/Slices/userSlice';
import ProtectedRoute from './ProtectedRoute'; // importe le nouveau composant


const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const AppRouter = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
      const exp = user?.exp;
      const now = Date.now() / 1000;

      

      // if (exp && exp < now) {
      //   // Token expiré : supprimer et rediriger
      //   localStorage.removeItem("token");
      //   window.location.href = "/login";
      //   dispatch(setUser(null));
      // } 
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route
                path="gestion-user"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GestionUser />
                  </ProtectedRoute>
                }
              />              <Route path="gestion-agent" element={<GestionAgent />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
