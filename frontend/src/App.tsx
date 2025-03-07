import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import VenueList from './components/venue/VenueList';
import BookingList from './components/booking/BookingList';
import Login from './components/auth/Login';
import { store } from './store';
import './App.css';

// 路由保护组件
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/venues" />
            </ProtectedRoute>
          } />
          <Route path="/venues" element={
            <ProtectedRoute>
              <Layout>
                <VenueList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <Layout>
                <BookingList />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
