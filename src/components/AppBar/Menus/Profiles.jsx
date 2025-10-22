import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt='XuanTranDev'
            src='https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/559208417_122105676435045160_2103911497491982084_n.jpg?stp=cp0_dst-jpg_s40x40_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=MgLb48kFLlkQ7kNvwEPN-xU&_nc_oc=Adm0_lectXQNJ4z8EXpvyE5uYG_xfwOmhwZh5cye1smhk7wl1bUz6MRfMZLC1vfV3jXLZC4OJaFGvECg9TLPbgXZ&_nc_zt=24&_nc_ht=scontent.fhan5-9.fna&_nc_gid=rQs3R1LnRyDH_q_A9lYRiA&oh=00_AfcvZQ5GzVDhkTS1SMNsiP9R0EefxvBxPI95CeuHLD5kmQ&oe=68FE65D1'
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <MenuItem>
          <Avatar sx={{ height:'28px', width:'28px', mr:2 }} /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ height:'28px', width:'28px', mr:2 }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles