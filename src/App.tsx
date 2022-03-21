import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import './App.scss';
import NavigationBar from './shared/NavigationBar/NavigationBar';
import Weather from './features/weather/Weather';

const App: React.FC = () => {

  return (
    <div className="App cold">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/weather" element={<Weather />} />
          {/* <Route path="/favorites" element={<Favorites />} /> */}

          {/* Default page */}
          <Route path="/" element={<Navigate replace to="/weather" />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>

    </div>
  );
}

export default App;
