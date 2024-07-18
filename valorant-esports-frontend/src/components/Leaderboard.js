import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper } from '@mui/material';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
    fetchTeamLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/leaderboard', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchTeamLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/leaderboard-teams', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching team leaderboard:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Leaderboard</Typography>
        
        <Typography variant="h5" gutterBottom>Top Players</Typography>
        {players.map(player => (
          <Paper key={player._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{player.name}</Typography>
            <Typography>Kills: {player.stats.kills}</Typography>
            <Typography>Deaths: {player.stats.deaths}</Typography>
            <Typography>Assists: {player.stats.assists}</Typography>
            <Typography>KDA: {player.stats.kda.toFixed(2)}</Typography>
          </Paper>
        ))}

        <Typography variant="h5" gutterBottom>Top Teams</Typography>
        {teams.map(team => (
          <Paper key={team._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{team.name}</Typography>
            <Typography>Wins: {team.stats.wins}</Typography>
            <Typography>Losses: {team.stats.losses}</Typography>
            <Typography>Total Games: {team.stats.totalGames}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}

export default Leaderboard;
