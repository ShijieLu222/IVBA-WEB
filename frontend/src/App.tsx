import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import VenueList from './components/venue/VenueList';
import BookingList from './components/booking/BookingList';
import { store } from './store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/venues" />} />
            <Route path="/venues" element={<VenueList />} />
            <Route path="/bookings" element={<BookingList />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
