import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent:'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
      //borderBottom: '1px solid #00fa5',
      borderBottom: '1px solid white',
      paddingX: '5px',
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
        <Chip sx={MENU_STYLE}
          icon={<DashboardIcon/>}
          label="Dash Board"
          clickable
        />
        <Chip sx={MENU_STYLE}
          icon={<VpnLockIcon/>}
          label="Public/Private Workspace"
          clickable
        />
        <Chip sx={MENU_STYLE}
          icon={<AddToDriveIcon/>}
          label="Add To Google Drive"
          clickable
        />
        <Chip sx={MENU_STYLE}
          icon={<BoltIcon/>}
          label="Automation"
          clickable
        />
        <Chip sx={MENU_STYLE}
          icon={<FilterListIcon/>}
          label="Filter"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0de' }
            }
          }}
        >
          <Tooltip>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip>
            <Avatar alt="Travis Howard" src="" />
          </Tooltip>
          <Tooltip>
            <Avatar alt="Cindy Baker" src="" />
          </Tooltip>
          <Tooltip>
            <Avatar alt="Agnes Walker" src="" />
          </Tooltip>
          <Tooltip>
            <Avatar alt="Trevor Henderson" src="" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
