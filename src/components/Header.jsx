import { React } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import AppDrawer from './AppDrawer';
import logo from '../images/hen.png';

export default function Header({
  loggedIn,
  setTokens,
  userDetails,
}) {
  const navigate = useNavigate();

  const getAccountMenu = () => {
    if (loggedIn) {
      return (
        <AccountMenu setTokens={setTokens} userDetails={userDetails} />
      );
    }
    return (
      <Button
        variant="contained"
        startIcon={
          <Avatar sx={{ width: 40, height: 40 }} />
        }
        onClick={() => navigate('/login')}
        sx={{
          ml: 'auto',
          color: 'white',
          bgcolor: 'primary.button',
        }}
      >
        <Typography
          variant="body2"
          sx={{
          }}
        >
          Sign In
        </Typography>
      </Button>
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{ height: '60px', justifyContent: 'center' }}
    >
      <Toolbar>
        <AppDrawer loggedIn={loggedIn} setTokens={setTokens} />
        <a href="/">
          <Avatar src={logo} />
        </a>
        {getAccountMenu()}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  loggedIn: PropTypes.bool,
  setTokens: PropTypes.func.isRequired,
  userDetails: PropTypes.shape({
    username: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
  }),
};

Header.defaultProps = {
  loggedIn: false,
  userDetails: null,
};
