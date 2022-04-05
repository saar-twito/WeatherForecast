import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from './components/NavigationBar/NavigationBar';
import Weather from './features/weather/Weather';
import FavoritesCities from './features/favorites/FavoritesCities';
import PageNotFound from './components/PageNotFound/PageNotFound';
import AppRoutes from './shared/routes';
import './App.scss';

const App = () => {

  return (
    <div className='App'>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path={AppRoutes.weather} element={<Weather />} />
          <Route path={AppRoutes.favorites} element={<FavoritesCities />} />

          {/* Default page */}
          <Route path="/" element={<Navigate replace to={AppRoutes.weather} />} />

          {/* 404 Route */}
          <Route path={AppRoutes.pageNotFound} element={<PageNotFound />} />
          <Route path="*" element={<Navigate replace to={AppRoutes.pageNotFound} />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>

    </div>
  );
}

export default App;
