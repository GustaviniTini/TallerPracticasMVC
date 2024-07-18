import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box, List, ListItem, ListItemText,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Paper, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Players() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [editPlayer, setEditPlayer] = useState(null);
  const [deletePlayer, setDeletePlayer] = useState(null);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/players', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/teams', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editPlayer) {
      try {
        await axios.put(`http://localhost:3000/api/players/${editPlayer._id}`, { name, team }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchPlayers();
        setEditPlayer(null);
        setName('');
        setTeam('');
      } catch (error) {
        console.error('Error updating player:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:3000/api/players', { name, team }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchPlayers();
        setName('');
        setTeam('');
      } catch (error) {
        console.error('Error creating player:', error);
      }
    }
  };

  const handleEdit = (player) => {
    setEditPlayer(player);
    setName(player.name);
    setTeam(player.team?._id || '');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/players/${deletePlayer._id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setPlayers(players.filter((player) => player._id !== deletePlayer._id));
      setDeletePlayer(null);
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  const handleResetStats = async () => {
    try {
      await axios.post('http://localhost:3000/api/players/reset-stats', {}, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      fetchPlayers();
      alert('Estadísticas de todos los jugadores restablecidas');
    } catch (error) {
      console.error('Error resetting player stats:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Players</Typography>
        {role === 'admin' && (
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Player Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Team</InputLabel>
                <Select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                >
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {editPlayer ? 'Update Player' : 'Add Player'}
              </Button>
            </form>
            <Button variant="contained" color="secondary" onClick={handleResetStats} fullWidth sx={{ mt: 2 }}>
              Reset All Player Stats
            </Button>
          </Paper>
        )}
        <List sx={{ mt: 4 }}>
          {players.map((player) => (
            <Paper key={player._id} sx={{ mb: 2 }}>
              <ListItem secondaryAction={
                role === 'admin' && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(player)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => setDeletePlayer(player)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }>
                <ListItemText primary={player.name} secondary={player.team?.name || 'No Team'} />
              </ListItem>
            </Paper>
          ))}
        </List>

        <Dialog open={!!deletePlayer} onClose={() => setDeletePlayer(null)}>
          <DialogTitle>Delete Player</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the player "{deletePlayer?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletePlayer(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Players;
