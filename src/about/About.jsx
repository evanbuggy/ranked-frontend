import * as React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import { blue } from '@mui/material/colors'
import { Box, Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'

const emails = ['username@gmail.com', 'user02@gmail.com']

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props

  const handleClose = () => {
    onClose(selectedValue)
  }

  const handleListItemClick = (value) => {
    onClose(value)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem disablePadding key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton autoFocus onClick={() => handleListItemClick('addAccount')}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  )
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
}

export default function About() {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(emails[1])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value) => {
    setOpen(false)
    setSelectedValue(value)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: 2,
        background:
          'radial-gradient(1000px 500px at 10% -10%, rgba(14, 165, 233, 0.25), transparent 60%), radial-gradient(900px 450px at 90% 0%, rgba(99, 102, 241, 0.22), transparent 55%), linear-gradient(180deg, #eef1ff 0%, #f7f8fc 100%)'
      }}
    >
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Button component={Link} to="/" variant="outlined" sx={{ mb: 2 }}>
          ← Tournament app
        </Button>
        <Typography variant="subtitle1" component="div">
          Selected: {selectedValue}
        </Typography>
        <br />
        <Button variant="outlined" onClick={handleClickOpen}>
          Open simple dialog
        </Button>
        <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Same demo as{' '}
          <MuiLink href="https://github.com/evanbuggy/ranked-frontend" target="_blank" rel="noreferrer">
            ranked-frontend
          </MuiLink>
          .
        </Typography>
      </Box>
    </Box>
  )
}
