import { React } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import AppDrawer from './AppDrawer';
import logo from '../images/hen.png';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[50],
    },
  },
});

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
      <ThemeProvider theme={theme}>
        <Button
          variant="outlined"
          startIcon={
            <Avatar sx={{ width: 40, height: 40 }} />
          }
          onClick={() => navigate('/login')}
        >
          <Typography variant="body2">
            Sign In
          </Typography>
        </Button>
      </ThemeProvider>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <AppDrawer loggedIn={loggedIn} setTokens={setTokens} />
        <a href="/">
          <Avatar src={logo} />
        </a>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          aCOUPlefarms
        </Typography>
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
