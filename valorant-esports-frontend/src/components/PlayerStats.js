import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, List, ListItem, ListItemText, Paper, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function PlayerStats() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchPlayers();
    fetchMatches();
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

  const getPlayerStats = (playerId) => {
    const stats = [];
    matches.forEach(match => {
      match.maps.forEach(map => {
        const playerStats = map.stats.find(stat => stat.player._id === playerId);
        if (playerStats) {
          stats.push({
            matchId: match._id, // Incluimos el identificador del partido
            matchName: `${match.team1.name} vs ${match.team2.name}`, // Incluimos el nombre del partido
            map: map.map.name,
            agent: playerStats.agent.name,
            kills: playerStats.kills,
            deaths: playerStats.deaths,
            assists: playerStats.assists
          });
        }
      });
    });
    return stats;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Player Statistics</Typography>
        <List sx={{ mt: 4 }}>
          {players.map((player) => (
            <Paper key={player._id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={player.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        Team: {player.team?.name || 'No Team'}
                      </Typography>
                      <Typography component="span" variant="body2" color="textPrimary" display="block">
                        Kills: {player.stats.kills} | Deaths: {player.stats.deaths} | Assists: {player.stats.assists}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Detailed Stats</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {getPlayerStats(player._id).map((stat, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`Match: ${stat.matchName} | Map: ${stat.map} | Agent: ${stat.agent}`}
                          secondary={`Kills: ${stat.kills} | Deaths: ${stat.deaths} | Assists: ${stat.assists}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default PlayerStats;
