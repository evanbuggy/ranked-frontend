import React, { useEffect, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DownloadIcon from '@mui/icons-material/Download'

import { API_BASE, apiFetch, getAuthToken, setAuthToken } from './api.js'

function statusChipColor(status) {
  if (status === 'COMPLETED') return 'success'
  if (status === 'FAILED') return 'error'
  return 'default'
}

export default function App() {
  const [auth, setAuth] = useState({ token: getAuthToken() || '' })
  const [authMode, setAuthMode] = useState('login')
  const [authError, setAuthError] = useState('')
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState('')
  const [newGroupName, setNewGroupName] = useState('')
  const [linkTournament, setLinkTournament] = useState('')
  const [importJobs, setImportJobs] = useState([])

  const [rankings, setRankings] = useState([])
  const [matrixPlayerRef, setMatrixPlayerRef] = useState('')
  const [matrixRows, setMatrixRows] = useState([])
  const [playerQuery, setPlayerQuery] = useState('')
  const [players, setPlayers] = useState([])

  const pollLock = useRef(false)

  useEffect(() => {
    const t = getAuthToken()
    if (t) setAuth({ token: t })
  }, [])

  useEffect(() => {
    if (!auth.token) return
    loadGroups()
  }, [auth.token])

  useEffect(() => {
    if (!auth.token || !groupId) return
    loadImportJobs()
    loadRankings()
  }, [auth.token, groupId])

  useEffect(() => {
    if (!auth.token || !groupId) return
    const interval = setInterval(() => {
      if (pollLock.current) return
      pollLock.current = true
      ;(async () => {
        try {
          await loadImportJobs()
        } catch (e) {
          console.error(e)
        } finally {
          pollLock.current = false
        }
      })()
    }, 4000)
    return () => clearInterval(interval)
  }, [auth.token, groupId])

  async function loadGroups() {
    try {
      const data = await apiFetch('/api/event-groups', { token: auth.token })
      setGroups(Array.isArray(data) ? data : [])
      if (!groupId && Array.isArray(data) && data.length > 0) setGroupId(String(data[0].id))
    } catch (e) {
      console.error(e)
    }
  }

  async function loadImportJobs() {
    if (!groupId) return
    const data = await apiFetch(`/api/internal-event-groups/${groupId}/imports`, { token: auth.token })
    setImportJobs(Array.isArray(data) ? data : [])
    const latest = Array.isArray(data) && data.length > 0 ? data[0] : null
    if (latest && latest.status === 'COMPLETED') loadRankings()
  }

  async function loadRankings() {
    if (!groupId) return
    const data = await apiFetch(`/api/ratings/event-groups/${groupId}/rankings`, { token: auth.token })
    setRankings(Array.isArray(data) ? data : [])
    if (!matrixPlayerRef && Array.isArray(data) && data.length > 0) setMatrixPlayerRef(data[0].playerRef)
    loadMatrix(data?.[0]?.playerRef || matrixPlayerRef)
  }

  async function loadMatrix(playerRef) {
    if (!groupId) return
    if (!playerRef) return
    const data = await apiFetch(
      `/api/ratings/event-groups/${groupId}/winloss-matrix?playerRef=${encodeURIComponent(playerRef)}`,
      { token: auth.token }
    )
    setMatrixRows(Array.isArray(data) ? data : [])
    setMatrixPlayerRef(playerRef)
  }

  async function handleLinkTournament() {
    await apiFetch(`/api/internal-event-groups/${groupId}/tournaments`, {
      method: 'POST',
      token: auth.token,
      body: { startggLink: linkTournament }
    })
    setLinkTournament('')
    loadImportJobs()
  }

  async function handleCreateGroup() {
    const eg = await apiFetch('/api/event-groups', {
      method: 'POST',
      token: auth.token,
      body: { name: newGroupName }
    })
    setNewGroupName('')
    await loadGroups()
    setGroupId(String(eg.id))
  }

  async function handleSubmitAuth() {
    setAuthError('')
    try {
      const path = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body =
        authMode === 'login'
          ? { usernameOrEmail, password }
          : { username, email, password }
      const res = await apiFetch(path, { method: 'POST', token: auth.token, body })
      setAuth({ token: res.token })
      setAuthToken(res.token)
      setUsernameOrEmail('')
      setUsername('')
      setEmail('')
      setPassword('')
      setAuthMode('login')
    } catch (e) {
      setAuthError(e.message || 'Authentication failed')
    }
  }

  async function handleExportCsv() {
    const res = await fetch(`${API_BASE}/api/ratings/event-groups/${groupId}/export/csv`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    const text = await res.text()
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `event-group-${groupId}-rankings.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleFetchPlayers() {
    if (!groupId) return
    const data = await apiFetch(
      `/api/ratings/event-groups/${groupId}/players?query=${encodeURIComponent(playerQuery || '')}`,
      { token: auth.token }
    )
    setPlayers(Array.isArray(data) ? data : [])
  }

  const matrixTitle =
    rankings.find((r) => r.playerRef === matrixPlayerRef)?.displayName || matrixPlayerRef || '—'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 3,
        px: 2,
        background:
          'radial-gradient(1000px 500px at 10% -10%, rgba(14, 165, 233, 0.25), transparent 60%), radial-gradient(900px 450px at 90% 0%, rgba(99, 102, 241, 0.22), transparent 55%), linear-gradient(180deg, #eef1ff 0%, #f7f8fc 100%)'
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h1" component="h1">
            Tournament Data Visualisation Tool
          </Typography>
          <Button component={RouterLink} to="/about" variant="outlined" size="small">
            About
          </Button>
        </Stack>

        {!auth.token && (
          <Card sx={{ mb: 3, background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.10) 0%, rgba(255,255,255,0.86) 80%)' }}>
            <CardContent>
              <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
                Authentication
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button
                  variant={authMode === 'login' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => {
                    setAuthMode('login')
                    setAuthError('')
                  }}
                >
                  Login
                </Button>
                <Button
                  variant={authMode === 'register' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => {
                    setAuthMode('register')
                    setAuthError('')
                  }}
                >
                  Register
                </Button>
              </Stack>

              {authError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {authError}
                </Alert>
              ) : null}

              <Stack spacing={1.5} sx={{ maxWidth: 420 }}>
                {authMode === 'login' ? (
                  <TextField
                    label="Username or Email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    fullWidth
                    size="small"
                  />
                ) : (
                  <>
                    <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth size="small" />
                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" />
                  </>
                )}
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button variant="contained" onClick={handleSubmitAuth} sx={{ alignSelf: 'flex-start' }}>
                  Submit
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {auth.token ? (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  setAuthToken('')
                  setAuth({ token: '' })
                  localStorage.removeItem('token')
                  setGroups([])
                  setGroupId('')
                }}
              >
                Logout
              </Button>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                alignItems: 'start'
              }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h2" gutterBottom>
                    Event Groups
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="eg-label">Event group</InputLabel>
                      <Select
                        labelId="eg-label"
                        label="Event group"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                      >
                        {groups.map((g) => (
                          <MenuItem key={g.id} value={String(g.id)}>
                            {g.name} (rev {g.statisticsRevision})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Stack direction="row" spacing={1}>
                      <TextField
                        placeholder="New event group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <Button variant="contained" onClick={handleCreateGroup}>
                        Create
                      </Button>
                    </Stack>

                    <Divider />

                    <Box>
                      <Typography variant="h3" gutterBottom>
                        Link tournament
                      </Typography>
                      <TextField
                        placeholder="Start.gg link or slug (e.g. spring-smash-2026)"
                        value={linkTournament}
                        onChange={(e) => setLinkTournament(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Button variant="contained" onClick={handleLinkTournament}>
                        Import
                      </Button>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="h3" gutterBottom>
                        Import jobs
                      </Typography>
                      {importJobs.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No imports yet.
                        </Typography>
                      ) : (
                        <Stack spacing={1.5}>
                          {importJobs.slice(0, 5).map((j) => (
                            <Stack
                              key={j.id}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight={700}>
                                  {j.tournamentRef}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(j.createdAt).toLocaleString()}
                                </Typography>
                                {j.failureReason ? (
                                  <Typography variant="caption" color="error" display="block">
                                    {j.failureReason}
                                  </Typography>
                                ) : null}
                              </Box>
                              <Chip label={j.status} color={statusChipColor(j.status)} size="small" />
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h2" gutterBottom>
                    Rankings &amp; matrix
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }} flexWrap="wrap" gap={1}>
                    <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExportCsv}>
                      Download CSV
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Click a row for win/loss matrix vs that player.
                    </Typography>
                  </Stack>

                  <TableContainer sx={{ borderRadius: 1, border: 1, borderColor: 'divider', mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light', '& .MuiTableCell-head': { color: 'primary.dark', fontWeight: 800 } }}>
                          <TableCell>Rank</TableCell>
                          <TableCell>Player</TableCell>
                          <TableCell>Elo</TableCell>
                          <TableCell>W-L</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rankings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant="body2" color="text.secondary">
                                Import tournaments to compute Elo.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          rankings.map((r, idx) => (
                            <TableRow
                              key={r.playerRef}
                              hover
                              selected={r.playerRef === matrixPlayerRef}
                              onClick={() => loadMatrix(r.playerRef)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell sx={{ fontWeight: r.playerRef === matrixPlayerRef ? 700 : 400 }}>{r.displayName}</TableCell>
                              <TableCell>{r.elo.toFixed(2)}</TableCell>
                              <TableCell>
                                {r.wins}-{r.losses}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h3" gutterBottom>
                    Win/loss matrix vs {matrixTitle}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      placeholder="Filter players by name"
                      value={playerQuery}
                      onChange={(e) => setPlayerQuery(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <Button variant="outlined" onClick={handleFetchPlayers}>
                      Search
                    </Button>
                  </Stack>

                  {players.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                      {players.slice(0, 30).map((p) => (
                        <Chip
                          key={p.playerRef}
                          label={p.displayName}
                          onClick={() => loadMatrix(p.playerRef)}
                          color={p.playerRef === matrixPlayerRef ? 'primary' : 'default'}
                          variant={p.playerRef === matrixPlayerRef ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Stack>
                  ) : null}

                  <TableContainer sx={{ borderRadius: 1, border: 1, borderColor: 'divider' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light', '& .MuiTableCell-head': { color: 'primary.dark', fontWeight: 800 } }}>
                          <TableCell>Opponent</TableCell>
                          <TableCell>Wins</TableCell>
                          <TableCell>Losses</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {matrixRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Typography variant="body2" color="text.secondary">
                                No matrix available yet.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          matrixRows.map((m) => (
                            <TableRow key={m.opponentRef}>
                              <TableCell>{m.opponentName}</TableCell>
                              <TableCell>{m.wins}</TableCell>
                              <TableCell>{m.losses}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  )
}
