import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box, List, ListItem, ListItemText,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Paper, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [editAgent, setEditAgent] = useState(null);
  const [deleteAgent, setDeleteAgent] = useState(null);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/agents', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const agentData = { name, icon };
    if (editAgent) {
      try {
        await axios.put(`http://localhost:3000/api/agents/${editAgent._id}`, agentData, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchAgents();
        setEditAgent(null);
        setName('');
        setIcon('');
      } catch (error) {
        console.error('Error updating agent:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:3000/api/agents', agentData, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchAgents();
        setName('');
        setIcon('');
      } catch (error) {
        console.error('Error creating agent:', error);
      }
    }
  };

  const handleEdit = (agent) => {
    setEditAgent(agent);
    setName(agent.name);
    setIcon(agent.icon);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/agents/${deleteAgent._id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setAgents(agents.filter((agent) => agent._id !== deleteAgent._id));
      setDeleteAgent(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Agents</Typography>
        {role === 'admin' && (
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Agent Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                label="Icon URL"
                fullWidth
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {editAgent ? 'Update Agent' : 'Add Agent'}
              </Button>
            </form>
          </Paper>
        )}
        <List sx={{ mt: 4 }}>
          {agents.map((agent) => (
            <Paper key={agent._id} sx={{ mb: 2 }}>
              <ListItem secondaryAction={
                role === 'admin' && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(agent)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => setDeleteAgent(agent)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }>
                <ListItemText
                  primary={agent.name}
                  secondary={<img src={agent.icon} alt={agent.name} style={{ width: 50 }} />}
                />
              </ListItem>
            </Paper>
          ))}
        </List>

        <Dialog open={!!deleteAgent} onClose={() => setDeleteAgent(null)}>
          <DialogTitle>Delete Agent</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the agent "{deleteAgent?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteAgent(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Agents;
