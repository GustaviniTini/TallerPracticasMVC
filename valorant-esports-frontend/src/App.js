import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teams from './components/Teams';
import Players from './components/Players';
import Matches from './components/Matches';
import PlayerStats from './components/PlayerStats';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Agents from './components/Agents';
import Maps from './components/Maps';
import PlayerComparison from './components/PlayerComparison';
import Leaderboard from './components/Leaderboard';

function App() {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout toggleTheme={toggleTheme} theme={theme} /></PrivateRoute>}>
            <Route path="teams" element={<Teams />} />
            <Route path="players" element={<Players />} />
            <Route path="matches" element={<Matches />} />
            <Route path="player-stats" element={<PlayerStats />} />
            <Route path="agents" element={<Agents />} />
            <Route path="maps" element={<Maps />} />
            <Route path="comparison" element={<PlayerComparison />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
