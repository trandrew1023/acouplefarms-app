import { React, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function AppDrawer({ loggedIn, setTokens }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const mainDrawerListItems = () => (
    <>
      <ListItemButton onClick={() => navigate('/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/organizations')}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Organizations" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/new-organization')}>
        <ListItemIcon>
          <PlaylistAddIcon />
        </ListItemIcon>
        <ListItemText primary="Add organization" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/profile')}>
        <ListItemIcon>
          <LoginIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton onClick={() => setTokens(null)}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </>
  );

  const secondaryDrawerListItems = () => (
    <>
      <ListItemButton onClick={() => navigate('/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/login')}>
        <ListItemIcon>
          <LoginIcon />
        </ListItemIcon>
        <ListItemText primary="Sign in" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/register')}>
        <ListItemIcon>
          <AppRegistrationIcon />
        </ListItemIcon>
        <ListItemText primary="Register" />
      </ListItemButton>
    </>
  );

  const drawer = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {loggedIn && mainDrawerListItems()}
      <Divider />
      {!loggedIn && secondaryDrawerListItems()}
    </Box>
  );

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer()}
      </Drawer>
    </>
  );
}

AppDrawer.propTypes = {
  tokens: PropTypes.shape({
    accessToken: PropTypes.string,
    refreshToken: PropTypes.string,
  }),
  loggedIn: PropTypes.bool.isRequired,
  setTokens: PropTypes.func.isRequired,
};

AppDrawer.defaultProps = {
  tokens: null,
};
