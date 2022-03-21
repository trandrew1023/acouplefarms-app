import { React, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import {
  getProfileImage,
  getUser,
} from '../service';

export default function AccountMenu({ setTokens }) {
  const [userDetails, setUserDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(async () => {
    const userDetailsResponse = await getUser();
    const profileImageResponse = await getProfileImage();
    if (userDetailsResponse) {
      setUserDetails(userDetailsResponse);
    } else {
      setUserDetails(null);
    }
    if (profileImageResponse) {
      setImageURL(profileImageResponse.data.url);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setTokens(null);
    navigate('/login');
  };

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const getUserIcon = () => (
    <Box sx={{
      ml: 'auto',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    }}
    >
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          {imageURL ? (
            <Avatar
              alt="Profile image"
              sx={{ bgcolor: 'white' }}
              src={imageURL}
            />
          ) : (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: stringToColor(userDetails.username),
              }}
            >
              <Typography sx={{ color: 'white' }}>
                {userDetails && userDetails.firstname.charAt(0).toUpperCase()}
                {userDetails && userDetails.lastname.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );

  const getUsername = () => {
    if (userDetails) {
      return (
        <>
          {imageURL ? (
            <Avatar
              alt="Profile image"
              src={imageURL}
              sx={{
                width: 100,
                height: 100,
              }}
            />
          ) : (
            <Avatar
              sx={{
                bgcolor: stringToColor(userDetails.username),
                color: 'text.primary',
              }}
            >
              <Typography sx={{ color: 'white' }}>
                {userDetails && userDetails.firstname.charAt(0).toUpperCase()}
                {userDetails && userDetails.lastname.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
          )}
          <Typography
            variant="h5"
            align="center"
          >
            {userDetails.username}
          </Typography>
        </>
      );
    }
    return null;
  };

  return (
    <>
      {userDetails && getUserIcon()}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          style: {
            width: 250,
          },
          elevation: 0,
          sx: {
            bgcolor: 'secondary.menu',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          {getUsername()}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

AccountMenu.propTypes = {
  setTokens: PropTypes.func.isRequired,
};
