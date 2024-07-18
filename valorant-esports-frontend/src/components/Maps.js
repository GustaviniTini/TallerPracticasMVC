import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box, List, ListItem, ListItemText,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Maps() {
  const [maps, setMaps] = useState([]);
  const [name, setName] = useState('');
  const [editMap, setEditMap] = useState(null);
  const [deleteMap, setDeleteMap] = useState(null);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/maps', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setMaps(response.data);
    } catch (error) {
      console.error('Error fetching maps:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMap) {
      try {
        await axios.put(`http://localhost:3000/api/maps/${editMap._id}`, { name }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchMaps();
        setEditMap(null);
        setName('');
      } catch (error) {
        console.error('Error updating map:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:3000/api/maps', { name }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setName('');
        fetchMaps();
      } catch (error) {
        console.error('Error creating map:', error);
      }
    }
  };

  const handleEdit = (map) => {
    setEditMap(map);
    setName(map.name);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/maps/${deleteMap._id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setMaps(maps.filter((map) => map._id !== deleteMap._id));
      setDeleteMap(null);
    } catch (error) {
      console.error('Error deleting map:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Maps</Typography>
        {role === 'admin' && (
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Map Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {editMap ? 'Update Map' : 'Add Map'}
              </Button>
            </form>
          </Paper>
        )}
        <List sx={{ mt: 4 }}>
          {maps.map((map) => (
            <Paper key={map._id} sx={{ mb: 2 }}>
              <ListItem secondaryAction={
                role === 'admin' && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(map)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => setDeleteMap(map)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }>
                <ListItemText primary={map.name} />
              </ListItem>
            </Paper>
          ))}
        </List>

        <Dialog open={!!deleteMap} onClose={() => setDeleteMap(null)}>
          <DialogTitle>Delete Map</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the map "{deleteMap?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteMap(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Maps;
