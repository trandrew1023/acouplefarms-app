import { React, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import { login } from '../service';
import logo from '../images/hen.png';

export default function Login({ setTokens }) {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });
  const [hasUsernameError, setUsernameError] = useState(false);
  const [hasPasswordError, setPasswordError] = useState(false);
  const [hasSubmitError, setSubmitError] = useState(false);
  const navigate = useNavigate();
  const theme = createTheme();
  const handleFormChange = (prop) => (event) => {
    setLoginDetails({ ...loginDetails, [prop]: event.target.value });
  };

  const copyright = () => (
    <Typography sx={{ mt: 6 }} variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        aCOUPlefarms
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );

  const hasErrors = () => {
    let hasError = false;
    setUsernameError(false);
    setPasswordError(false);
    if (!loginDetails.username) {
      hasError = true;
      setUsernameError(true);
    }
    if (!loginDetails.password) {
      hasError = true;
      setPasswordError(true);
    }
    setSubmitError(hasError);
    return hasError;
  };

  const handleLogin = async () => {
    if (hasErrors()) {
      return;
    }
    const tokens = await login(loginDetails);
    if (!tokens) {
      setSubmitError(true);
      return;
    }
    setTokens(tokens);
    navigate('/');
  };

  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleLogin();
    }
  };

  const loginFailed = () => (
    <Typography variant="body1" color="red">
      Wrong username or password
    </Typography>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: 'primary' }}
            src={logo}
            variant="rounded"
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              error={hasUsernameError}
              onChange={handleFormChange('username')}
              onKeyPress={handleKeypress}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={hasPasswordError}
              onChange={handleFormChange('password')}
              onKeyPress={handleKeypress}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {hasSubmitError && loginFailed()}
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Don&apos;t have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {copyright()}
      </Container>
    </ThemeProvider>
  );
}

Login.propTypes = {
  setTokens: PropTypes.func.isRequired,
};
