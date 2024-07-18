import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box, List, ListItem, ListItemText,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Paper, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [maps, setMaps] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedMaps, setSelectedMaps] = useState([{ mapId: '', team1Score: '', team2Score: '', stats: {} }]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [editMatch, setEditMatch] = useState(null);
  const [deleteMatch, setDeleteMatch] = useState(null);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchMatches(), fetchTeams(), fetchPlayers(), fetchMaps(), fetchAgents()]);
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/matches', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
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

  const handleMapChange = (index, field, value) => {
    const newMaps = [...selectedMaps];
    newMaps[index][field] = value;
    setSelectedMaps(newMaps);
  };

  const handleStatsChange = (mapIndex, playerId, stat, value) => {
    const newMaps = [...selectedMaps];
    if (!newMaps[mapIndex].stats[playerId]) {
      newMaps[mapIndex].stats[playerId] = { kills: 1, deaths: 1, assists: 1, agent: '' };
    }
    newMaps[mapIndex].stats[playerId][stat] = value;
    setSelectedMaps(newMaps);
  };

  const handleAgentChange = (mapIndex, playerId, agent) => {
    const newMaps = [...selectedMaps];
    if (!newMaps[mapIndex].stats[playerId]) {
      newMaps[mapIndex].stats[playerId] = { kills: 1, deaths: 1, assists: 1, agent: '' };
    }
    newMaps[mapIndex].stats[playerId].agent = agent;
    setSelectedMaps(newMaps);
  };

  const handleAddMap = () => {
    if (selectedMaps.length < 3) {
      setSelectedMaps([...selectedMaps, { mapId: '', team1Score: '', team2Score: '', stats: {} }]);
    }
  };

  const handleRemoveMap = (index) => {
    const newMaps = selectedMaps.filter((_, i) => i !== index);
    setSelectedMaps(newMaps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const matchData = { team1, team2, maps: selectedMaps };

    if (editMatch) {
      try {
        await axios.put(`http://localhost:3000/api/matches/${editMatch._id}`, matchData, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchMatches();
        setEditMatch(null);
        resetForm();
      } catch (error) {
        console.error('Error updating match:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:3000/api/matches', matchData, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchMatches();
        resetForm();
      } catch (error) {
        console.error('Error creating match:', error);
      }
    }
  };

  const handleEdit = (match) => {
    setEditMatch(match);
    setTeam1(match.team1._id);
    setTeam2(match.team2._id);
    setSelectedMaps(match.maps.map((map) => ({
      mapId: map.map._id,
      team1Score: map.team1Score,
      team2Score: map.team2Score,
      stats: map.stats.reduce((acc, stat) => {
        acc[stat.player._id] = { kills: stat.kills || 1, deaths: stat.deaths || 1, assists: stat.assists || 1, agent: stat.agent._id };
        return acc;
      }, {})
    })));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/matches/${deleteMatch._id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setMatches(matches.filter((match) => match._id !== deleteMatch._id));
      setDeleteMatch(null);
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const resetForm = () => {
    setTeam1('');
    setTeam2('');
    setSelectedMaps([{ mapId: '', team1Score: '', team2Score: '', stats: {} }]);
  };

  const renderPlayerStats = (teamId, mapIndex) => {
    return players.filter(player => player.team && player.team._id === teamId).map(player => (
      <Box key={player._id} sx={{ mb: 2 }}>
        <Typography variant="subtitle1">{player.name}</Typography>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Agent</InputLabel>
          <Select
            value={selectedMaps[mapIndex].stats && selectedMaps[mapIndex].stats[player._id] ? selectedMaps[mapIndex].stats[player._id].agent : ''}
            onChange={(e) => handleAgentChange(mapIndex, player._id, e.target.value)}
          >
            {agents.map((agent) => (
              <MenuItem key={agent._id} value={agent._id}>{agent.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Kills"
          fullWidth
          type="number"
          value={selectedMaps[mapIndex].stats && selectedMaps[mapIndex].stats[player._id] ? selectedMaps[mapIndex].stats[player._id].kills : ''}
          onChange={(e) => handleStatsChange(mapIndex, player._id, 'kills', e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Deaths"
          fullWidth
          type="number"
          value={selectedMaps[mapIndex].stats && selectedMaps[mapIndex].stats[player._id] ? selectedMaps[mapIndex].stats[player._id].deaths : ''}
          onChange={(e) => handleStatsChange(mapIndex, player._id, 'deaths', e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Assists"
          fullWidth
          type="number"
          value={selectedMaps[mapIndex].stats && selectedMaps[mapIndex].stats[player._id] ? selectedMaps[mapIndex].stats[player._id].assists : ''}
          onChange={(e) => handleStatsChange(mapIndex, player._id, 'assists', e.target.value)}
          required
          margin="normal"
        />
      </Box>
    ));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Matches</Typography>
        {role === 'admin' && (
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Team 1</InputLabel>
                <Select
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                >
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Team 2</InputLabel>
                <Select
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                >
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedMaps.map((map, mapIndex) => (
                <Box key={mapIndex} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Map</InputLabel>
                    <Select
                      value={map.mapId}
                      onChange={(e) => handleMapChange(mapIndex, 'mapId', e.target.value)}
                    >
                      {maps.map((map) => (
                        <MenuItem key={map._id} value={map._id}>{map.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Team 1 Score"
                    fullWidth
                    value={map.team1Score}
                    onChange={(e) => handleMapChange(mapIndex, 'team1Score', e.target.value)}
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Team 2 Score"
                    fullWidth
                    value={map.team2Score}
                    onChange={(e) => handleMapChange(mapIndex, 'team2Score', e.target.value)}
                    required
                    margin="normal"
                  />
                  <Typography variant="h6" gutterBottom>Player Stats Team 1 ({teams.find(team => team._id === team1)?.name})</Typography>
                  {renderPlayerStats(team1, mapIndex)}
                  <Typography variant="h6" gutterBottom>Player Stats Team 2 ({teams.find(team => team._id === team2)?.name})</Typography>
                  {renderPlayerStats(team2, mapIndex)}
                  {selectedMaps.length > 1 && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveMap(mapIndex)}
                      sx={{ mt: 1 }}
                    >
                      Remove Map
                    </Button>
                  )}
                </Box>
              ))}
              {selectedMaps.length < 3 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddMap}
                  sx={{ mt: 2 }}
                >
                  Add Map
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {editMatch ? 'Update Match' : 'Add Match'}
              </Button>
            </form>
          </Paper>
        )}
        <List sx={{ mt: 4 }}>
          {matches.map((match) => (
            <Paper key={match._id} sx={{ mb: 2 }}>
              <ListItem secondaryAction={
                role === 'admin' && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(match)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => setDeleteMatch(match)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }>
                <ListItemText
                  primary={`${match.team1.name} vs ${match.team2.name}`}
                  secondary={`Winner: ${match.winner ? match.winner.name : 'TBD'}`}
                />
              </ListItem>
            </Paper>
          ))}
        </List>

        <Dialog open={!!deleteMatch} onClose={() => setDeleteMatch(null)}>
          <DialogTitle>Delete Match</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the match between "{deleteMatch?.team1.name}" and "{deleteMatch?.team2.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteMatch(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Matches;
