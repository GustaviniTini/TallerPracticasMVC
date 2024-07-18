import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box, List, ListItem, ListItemText,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [editTeam, setEditTeam] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(null);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    fetchTeams();
  }, []);

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
    if (editTeam) {
      try {
        await axios.put(`http://localhost:3000/api/teams/${editTeam._id}`, { name }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchTeams();
        setEditTeam(null);
        setName('');
      } catch (error) {
        console.error('Error updating team:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:3000/api/teams', { name }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setName('');
        fetchTeams();
      } catch (error) {
        console.error('Error creating team:', error);
      }
    }
  };

  const handleEdit = (team) => {
    setEditTeam(team);
    setName(team.name);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/teams/${deleteTeam._id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setTeams(teams.filter((team) => team._id !== deleteTeam._id));
      setDeleteTeam(null);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Teams</Typography>
        {role === 'admin' && (
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Team Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {editTeam ? 'Update Team' : 'Add Team'}
              </Button>
            </form>
          </Paper>
        )}
        <List sx={{ mt: 4 }}>
          {teams.map((team) => (
            <Paper key={team._id} sx={{ mb: 2 }}>
              <ListItem secondaryAction={
                role === 'admin' && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(team)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => setDeleteTeam(team)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }>
                <ListItemText primary={team.name} />
              </ListItem>
            </Paper>
          ))}
        </List>

        <Dialog open={!!deleteTeam} onClose={() => setDeleteTeam(null)}>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the team "{deleteTeam?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTeam(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Teams;
