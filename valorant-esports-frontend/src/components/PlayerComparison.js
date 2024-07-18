import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, FormControl, InputLabel, Select, MenuItem, Button, Typography, Box, Paper
} from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function PlayerComparison() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [agents, setAgents] = useState([]);
  const [maps, setMaps] = useState([]);

  const [comparePlayers, setComparePlayers] = useState({ player1: '', player2: '' });
  const [compareBestPlayerAgent, setCompareBestPlayerAgent] = useState({ agent: '' });
  const [compareBestPlayerMap, setCompareBestPlayerMap] = useState({ map: '' });
  const [compareTeamsMap, setCompareTeamsMap] = useState({ team1: '', team2: '', map: '' });
  const [playerPerformanceTrend, setPlayerPerformanceTrend] = useState({ player: '' });
  const [playerBestAgents, setPlayerBestAgents] = useState({ player: '' });
  const [teamMapPerformance, setTeamMapPerformance] = useState({ team: '' });

  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparisonType, setComparisonType] = useState('');

  useEffect(() => {
    fetchPlayers();
    fetchAgents();
    fetchMaps();
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

  const handleComparePlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/compare-players', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: {
          player1Id: comparePlayers.player1,
          player2Id: comparePlayers.player2
        }
      });
      setComparisonResult(response.data);
      setComparisonType('players');
    } catch (error) {
      console.error('Error comparing players:', error);
    }
  };

  const handleCompareBestPlayerAgent = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/best-player-agent', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: {
          agentId: compareBestPlayerAgent.agent
        }
      });
      setComparisonResult(response.data);
      setComparisonType('agent');
    } catch (error) {
      console.error('Error comparing best player with agent:', error);
    }
  };

  const handleCompareBestPlayerMap = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/best-player-map', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: {
          mapId: compareBestPlayerMap.map
        }
      });
      setComparisonResult(response.data);
      setComparisonType('map');
    } catch (error) {
      console.error('Error comparing best player in map:', error);
    }
  };

  const handleCompareTeamsMap = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/compare-teams-map', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: {
          team1Id: compareTeamsMap.team1,
          team2Id: compareTeamsMap.team2,
          mapId: compareTeamsMap.map
        }
      });
      setComparisonResult(response.data);
      setComparisonType('teams');
    } catch (error) {
      console.error('Error comparing teams in map:', error);
    }
  };

  const handlePlayerPerformanceTrend = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/player-performance-trend', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: { playerId: playerPerformanceTrend.player }
      });
      setComparisonResult(response.data);
      setComparisonType('performanceTrend');
    } catch (error) {
      console.error('Error fetching player performance trend:', error);
    }
  };

  const handlePlayerBestAgents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/player-best-agents', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: { playerId: playerBestAgents.player }
      });
      setComparisonResult(response.data);
      setComparisonType('playerBestAgents');
    } catch (error) {
      console.error('Error fetching player best agents:', error);
    }
  };

  const handleTeamMapPerformance = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comparisons/team-map-performance', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        params: { teamId: teamMapPerformance.team }
      });
      setComparisonResult(response.data);
      setComparisonType('teamMapPerformance');
    } catch (error) {
      console.error('Error fetching team map performance:', error);
    }
  };

  const formatKDA = (kda) => {
    if (kda && typeof kda === 'number') {
      return kda.toFixed(2);
    }
    return 'N/A';
  };

  const renderComparisonResult = () => {
    if (comparisonType === 'players' && comparisonResult) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Comparison Result</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Player 1 Stats</Typography>
            <Typography>Kills: {comparisonResult.player1.stats.kills}</Typography>
            <Typography>Deaths: {comparisonResult.player1.stats.deaths}</Typography>
            <Typography>Assists: {comparisonResult.player1.stats.assists}</Typography>
            <Typography>KDA: {formatKDA(comparisonResult.player1.kda)}</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Player 2 Stats</Typography>
            <Typography>Kills: {comparisonResult.player2.stats.kills}</Typography>
            <Typography>Deaths: {comparisonResult.player2.stats.deaths}</Typography>
            <Typography>Assists: {comparisonResult.player2.stats.assists}</Typography>
            <Typography>KDA: {formatKDA(comparisonResult.player2.kda)}</Typography>
          </Paper>
        </Box>
      );
    } else if (comparisonType === 'agent' && comparisonResult) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Best Player Result</Typography>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Best Player Stats</Typography>
            <Typography>Name: {comparisonResult.name}</Typography>
            <Typography>Kills: {comparisonResult.kills}</Typography>
            <Typography>Deaths: {comparisonResult.deaths}</Typography>
            <Typography>Assists: {comparisonResult.assists}</Typography>
            <Typography>KDA: {formatKDA(comparisonResult.kda)}</Typography>
          </Paper>
        </Box>
      );
    } else if (comparisonType === 'map' && comparisonResult) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Best Player Result</Typography>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Best Player Stats</Typography>
            <Typography>Name: {comparisonResult.name}</Typography>
            <Typography>Kills: {comparisonResult.kills}</Typography>
            <Typography>Deaths: {comparisonResult.deaths}</Typography>
            <Typography>Assists: {comparisonResult.assists}</Typography>
            <Typography>KDA: {formatKDA(comparisonResult.kda)}</Typography>
          </Paper>
        </Box>
      );
    } else if (comparisonType === 'teams' && comparisonResult) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Comparison Result</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Team 1 Stats</Typography>
            <Typography>Kills: {comparisonResult.team1.stats.kills}</Typography>
            <Typography>Deaths: {comparisonResult.team1.stats.deaths}</Typography>
            <Typography>Assists: {comparisonResult.team1.stats.assists}</Typography>
            <Typography>Avg Kills: {comparisonResult.team1.avgKills.toFixed(2)}</Typography>
            <Typography>KDA: {formatKDA(comparisonResult.team1.kda)}</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Team 2 Stats</Typography>
            <Typography>Kills: {comparisonResult.team2.stats.kills}</Typography>
            <Typography>Deaths: {comparisonResult.team2.stats.deaths}</Typography>
            <Typography>Assists: {comparisonResult.team2.stats.assists}</Typography>
            <Typography>Avg Kills: {comparisonResult.team2.avgKills.toFixed(2)}</Typography>
            <Typography>KDA: {formatKDA(comparisonResult.team2.kda)}</Typography>
          </Paper>
        </Box>
      );
    } else if (comparisonType === 'performanceTrend' && comparisonResult) {
      const trendData = comparisonResult.map((trend, index) => ({
        match: `Match ${index + 1}`,
        kills: trend.kills,
        deaths: trend.deaths,
        assists: trend.assists,
        kda: formatKDA(trend.kda)
      }));
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Performance Trend</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <LineChart width={600} height={300} data={trendData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="match" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kills" stroke="#8884d8" />
              <Line type="monotone" dataKey="deaths" stroke="#82ca9d" />
              <Line type="monotone" dataKey="assists" stroke="#ffc658" />
              <Line type="monotone" dataKey="kda" stroke="#ff7300" />
            </LineChart>
          </Paper>
        </Box>
      );
    } else if (comparisonType === 'playerBestAgents' && comparisonResult) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Player Best Agents</Typography>
          {comparisonResult.map((agent, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Agent: {agent.name}</Typography>
              <Typography>Kills: {agent.kills}</Typography>
              <Typography>Deaths: {agent.deaths}</Typography>
              <Typography>Assists: {agent.assists}</Typography>
              <Typography>KDA: {formatKDA(agent.kda)}</Typography>
              <Typography>Matches: {agent.matches}</Typography>
            </Paper>
          ))}
        </Box>
      );
    } else if (comparisonType === 'teamMapPerformance' && comparisonResult) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Team Map Performance</Typography>
          {comparisonResult.map((map, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{map.name}</Typography>
              <Typography>Kills: {map.kills}</Typography>
              <Typography>Deaths: {map.deaths}</Typography>
              <Typography>Assists: {map.assists}</Typography>
              <Typography>KDA: {formatKDA(map.kda)}</Typography>
              <Typography>Matches: {map.matches}</Typography>
            </Paper>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Player Comparison</Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Player 1</InputLabel>
            <Select
              value={comparePlayers.player1}
              onChange={(e) => setComparePlayers({ ...comparePlayers, player1: e.target.value })}
            >
              {players.map((player) => (
                <MenuItem key={player._id} value={player._id}>{player.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Player 2</InputLabel>
            <Select
              value={comparePlayers.player2}
              onChange={(e) => setComparePlayers({ ...comparePlayers, player2: e.target.value })}
            >
              {players.map((player) => (
                <MenuItem key={player._id} value={player._id}>{player.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleComparePlayers}
            disabled={!comparePlayers.player1 || !comparePlayers.player2}
          >
            Compare Players
          </Button>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Agent</InputLabel>
            <Select
              value={compareBestPlayerAgent.agent}
              onChange={(e) => setCompareBestPlayerAgent({ agent: e.target.value })}
            >
              {agents.map((agent) => (
                <MenuItem key={agent._id} value={agent._id}>{agent.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCompareBestPlayerAgent}
            disabled={!compareBestPlayerAgent.agent}
          >
            Compare Best Player with Agent
          </Button>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Map</InputLabel>
            <Select
              value={compareBestPlayerMap.map}
              onChange={(e) => setCompareBestPlayerMap({ map: e.target.value })}
            >
              {maps.map((map) => (
                <MenuItem key={map._id} value={map._id}>{map.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCompareBestPlayerMap}
            disabled={!compareBestPlayerMap.map}
          >
            Compare Best Player in Map
          </Button>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Team 1</InputLabel>
            <Select
              value={compareTeamsMap.team1}
              onChange={(e) => setCompareTeamsMap({ ...compareTeamsMap, team1: e.target.value })}
            >
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Team 2</InputLabel>
            <Select
              value={compareTeamsMap.team2}
              onChange={(e) => setCompareTeamsMap({ ...compareTeamsMap, team2: e.target.value })}
            >
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Map</InputLabel>
            <Select
              value={compareTeamsMap.map}
              onChange={(e) => setCompareTeamsMap({ ...compareTeamsMap, map: e.target.value })}
            >
              {maps.map((map) => (
                <MenuItem key={map._id} value={map._id}>{map.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCompareTeamsMap}
            disabled={!compareTeamsMap.team1 || !compareTeamsMap.team2 || !compareTeamsMap.map}
          >
            Compare Teams in Map
          </Button>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Player</InputLabel>
            <Select
              value={playerPerformanceTrend.player}
              onChange={(e) => setPlayerPerformanceTrend({ player: e.target.value })}
            >
              {players.map((player) => (
                <MenuItem key={player._id} value={player._id}>{player.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handlePlayerPerformanceTrend}
            disabled={!playerPerformanceTrend.player}
          >
            View Player Performance Trend
          </Button>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Player</InputLabel>
            <Select
              value={playerBestAgents.player}
              onChange={(e) => setPlayerBestAgents({ player: e.target.value })}
            >
              {players.map((player) => (
                <MenuItem key={player._id} value={player._id}>{player.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handlePlayerBestAgents}
            disabled={!playerBestAgents.player}
          >
            View Player Best Agents
          </Button>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Team</InputLabel>
            <Select
              value={teamMapPerformance.team}
              onChange={(e) => setTeamMapPerformance({ team: e.target.value })}
            >
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleTeamMapPerformance}
            disabled={!teamMapPerformance.team}
          >
            View Team Map Performance
          </Button>
        </Paper>

        {renderComparisonResult()}
      </Box>
    </Container>
  );
}

export default PlayerComparison;
