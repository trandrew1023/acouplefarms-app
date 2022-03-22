import { React, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = createTheme();
  const handleFormChange = (prop) => (event) => {
    setLoginDetails({ ...loginDetails, [prop]: event.target.value });
  };

  useEffect(() => {
    document.title = 'Login - aCOUPlefarms';
    window.scrollTo(0, 0);
  });

  const copyright = () => (
    <Typography
      sx={{
        mt: 6,
        mb: 6,
      }}
      variant="body2"
      color="text.secondary"
      align="center"
    >
      {'Copyright © '}
      <Link color="inherit" href="/">
        aCOUPlefarms
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
      e.preventDefault();
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: 'primary', mt: '100px' }}
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={hasPasswordError}
              onChange={handleFormChange('password')}
              onKeyPress={handleKeypress}
              InputProps={{
                endAdornment:
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>,
              }}
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
                <Link href="/forgot-password" variant="body2">
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
