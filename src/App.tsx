import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from './components/NavigationBar/NavigationBar';
import Weather from './features/weather/Weather';
import FavoritesCities from './features/favorites/FavoritesCities';
import PageNotFound from './components/PageNotFound/PageNotFound';
import './App.scss';

const App = () => {

  return (
    <div className={`App cold`}>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/weather" element={<Weather />} />
          <Route path="/favorites" element={<FavoritesCities />} />

          {/* Default page */}
          <Route path="/" element={<Navigate replace to="/weather" />} />

          {/* 404 Route */}
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate replace to="page-not-found" />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>

    </div>
  );
}

export default App;
