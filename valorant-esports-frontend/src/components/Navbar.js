import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function Navbar({ toggleTheme, theme }) {
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Valorant Esports
        </Typography>
        <Button color="inherit" component={Link} to="/teams">Teams</Button>
        <Button color="inherit" component={Link} to="/players">Players</Button>
        <Button color="inherit" component={Link} to="/matches">Matches</Button>
        <Button color="inherit" component={Link} to="/player-stats">Player Stats</Button>
        <Button color="inherit" component={Link} to="/agents">Agents</Button>
        <Button color="inherit" component={Link} to="/maps">Maps</Button>
        <Button color="inherit" component={Link} to="/comparison">Comparison</Button>
        <Button color="inherit" component={Link} to="/leaderboard">Leaderboard</Button>
        {role === 'admin' && (
          <Box sx={{
            mx: 2,
            px: 2,
            py: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" component="div" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Admin Dashboard
            </Typography>
          </Box>
        )}
        <IconButton color="inherit" onClick={toggleTheme}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
