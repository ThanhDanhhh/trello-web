import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'


const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  ' .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50',
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid white',
    }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="TylerDangDev MERN Stack Pro"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
            }
          }}
        >Invite</Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiSvgIcon-root': {
              width: 34,
              heigth: 34,
              fontSize: 16,
              border: 'none',
            }
          }}
        >
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://avatars.githubusercontent.com/u/73952767?s=400&u=9ad1da9142e7d67edc92481ec83437fa3a4d65cb&v=4"
            />
          </Tooltip>
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/446907149_1938187889974192_7370441549478678026_n.jpg?stp=cp6_dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=yHq4nGwh1HQQ7kNvgE55iIH&_nc_oc=AdibpTLkKAdzOdu6fJqzG4GAUGGvveKWQzNvdjtVwJNb-mCDnzSEVoyDKTqxNAFyeUk&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AlqJH97yfnVig8bvxRsiTc0&oh=00_AYBiecqgOI8PdcAOMnLnWHLwZpl7Xcrd0K1mdoz_gZhBwA&oe=678D31B7"
            />
          </Tooltip>
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/350973975_1591095651381673_6257878776501092254_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=qnHjf465uc0Q7kNvgFZyAP2&_nc_oc=Adj_Ccsy3cfWREuOjxBs33t2hqqQrtV-uuAmuZ2vuFRWtDx5K5RdrEpXz2ae9iy2hNE&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AJc5T6JebpMyYHt0OCpvhMN&oh=00_AYDmYYIoYnlUf3-SlkaMekmcCE2HatEAiXdLWB2uftUwCw&oe=678D29FB"
            />
          </Tooltip>
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/342211170_263886045976293_365773910668429128_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=P5SJzRAONhQQ7kNvgEGx1t4&_nc_oc=Adj6uLv6xDr-6SVYRhbK9rzgF-0K8bBEQcS8TIoTKahyxWlVkQ4yVMtsFIyKYS8qUh0&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=Aro6iY8VvAYZqs_REpcpDiY&oh=00_AYCeWygIwN4NRiwq7ddstzq2GCOp8gvUfQP8PjljvOSZiA&oe=678D1F06"
            />
          </Tooltip>
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/349887833_121130407652394_5493458694478469165_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rPUCnD4El_4Q7kNvgHNdycK&_nc_oc=Adg_30APH6psfgzAERJjgHv-kpAb3KqV0ceSEoggXoAJXVHdwamaBuYPGEsNk1Dm9NU&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AfL9umxrJuQFaoPXIeVGkC6&oh=00_AYDi-th7KgQ3wF70Enf7uK7KcFnlezby3D-SEKAdN9ijZw&oe=678D3A2D"
            />
          </Tooltip>
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://www.facebook.com/photo/?fbid=1001255103667480&set=a.181406595652339&__cft__[0]=AZXYyCNddTEy7uLBUGBeqQxWW6XkN1aASYYVelGgxWeDOK5mnqVD7-HiUOHzxnl9yu5TBp2Ius-o_Idpw4tQA1jvn6p4FBo9ePd5Jy_Wr7vV1FsXdxy9BA8BFRbnbQz9iTd-tF-KSMmMM8U3CaZCy1Mz3hdXxoMScl1D5unrrQhQMA&__tn__=EH-R"
            />
          </Tooltip>
          <Tooltip title="TylerDangDev">
            <Avatar
              alt="TylerDangDev"
              src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/458437134_2007003119759335_9186355681134056046_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=xKWwLLfZlIkQ7kNvgGoMWFf&_nc_oc=AdjA0NpJ2kGoaYZwVGD8aIzx_PGYBXh8_bf-BiRk6llxNhPjXAZv4ceRhwAQEtli8fI&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AqTPOxBiM7ZkTcU_dYeqfjv&oh=00_AYBiAvNI8dLJc0c4qde9j7h4GFayiaSkDEN1IbPWA8DrKA&oe=678D2161"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar
