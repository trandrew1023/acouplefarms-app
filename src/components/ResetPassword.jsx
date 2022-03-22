import { React, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSearchParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { checkResetToken, resetPassword } from '../service';
import logo from '../images/hen.png';

export default function ResetPassword() {
  /* eslint-disable no-unused-vars */
  const [searchParams, setSearchParams] = useSearchParams();
  const [formDetails, setFormDetails] = useState({
    password: '',
    secondaryPassword: '',
  });
  const [hasSecondaryPasswordError, setSecondaryPasswordError] = useState(false);
  const [showSecondaryPassword, setShowSecondaryPassword] = useState(false);
  const [passwordsNotMatching, setPasswordsNotMatching] = useState(false);
  const [hasPasswordError, setPasswordError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenUsed, setTokenUsed] = useState(false);
  // const navigate = useNavigate();
  const theme = createTheme();
  const handleFormChange = (prop) => (event) => {
    setFormDetails({ ...formDetails, [prop]: event.target.value });
  };

  useEffect(async () => {
    document.title = 'Reset Password - aCOUPlefarms';
    window.scrollTo(0, 0);
    const response = await checkResetToken(searchParams.get('token'));
    if (response.status !== 204) {
      setTokenUsed(true);
    }
  }, []);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const copyright = () => (
    <Typography sx={{ mt: 6 }} variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        aCOUPlefarms
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );

  const resetErrors = () => {
    setSecondaryPasswordError(false);
    setShowSecondaryPassword(false);
    setPasswordsNotMatching(false);
    setPasswordError(false);
    setSubmitSuccess(false);
    setShowPassword(false);
  };

  const clearForm = () => {
    resetErrors();
    setFormDetails({
      password: '',
      secondaryPassword: '',
    });
  };

  const hasErrors = () => {
    let hasError = false;
    if (!formDetails.password) {
      setPasswordError(true);
      hasError = true;
    }
    if (!formDetails.secondaryPassword) {
      setSecondaryPasswordError(true);
      hasError = true;
    }
    if (formDetails.password !== formDetails.secondaryPassword) {
      setPasswordsNotMatching(true);
      hasError = true;
    }
    return hasError;
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    resetErrors();
    if (hasErrors()) {
      setIsLoading(false);
      return;
    }
    const response = await resetPassword({
      token: searchParams.get('token'),
      newPassword: formDetails.password,
    });
    if (response.status === 204) {
      clearForm();
      setSubmitSuccess(true);
    } else {
      setTokenUsed(true);
    }
    setIsLoading(false);
  };

  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleResetPassword();
    }
  };

  const fillOutFieldsMessage = () => (
    <Typography variant="body1" color="red">
      Please fill out all required fields
    </Typography>
  );

  const tokenUsedMessage = () => (
    <Typography variant="body1" color="red">
      The link has either been used or is expired. Please request a new link to reset your password
    </Typography>
  );

  const passwordsNotMatchingMessage = () => (
    <Typography variant="body1" color="red">
      Passwords do not match
    </Typography>
  );

  const successMessage = () => (
    <Typography variant="body1" color="blue">
      Password has been reset.
      {' '}
      <a href="/login">Sign in here</a>
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
            Reset password
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={hasPasswordError}
              disabled={tokenUsed}
              value={formDetails.password}
              onChange={handleFormChange('password')}
              onKeyPress={handleKeypress}
              InputProps={{
                endAdornment:
                  <IconButton
                    disabled={tokenUsed}
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Re-enter password"
              type={showSecondaryPassword ? 'text' : 'password'}
              id="secondaryPassword"
              autoComplete="current-password"
              error={hasSecondaryPasswordError}
              disabled={tokenUsed}
              value={formDetails.secondaryPassword}
              onChange={handleFormChange('secondaryPassword')}
              onKeyPress={handleKeypress}
              InputProps={{
                endAdornment:
                  <IconButton
                    disabled={tokenUsed}
                    aria-label="toggle password visibility"
                    onClick={() => setShowSecondaryPassword(!showSecondaryPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showSecondaryPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>,
              }}
            />
            {(hasPasswordError || hasSecondaryPasswordError) ? fillOutFieldsMessage()
              : (passwordsNotMatching && passwordsNotMatchingMessage())}
            {tokenUsed && tokenUsedMessage()}
            {submitSuccess && successMessage()}
            <Button
              fullWidth
              disabled={tokenUsed || submitSuccess || isLoading}
              variant="contained"
              onClick={handleResetPassword}
              sx={{ mt: 3, mb: 2 }}
            >
              Reset password
              {isLoading && (
                <CircularProgress
                  size={30}
                  sx={{
                    position: 'absolute',
                  }}
                />
              )}
            </Button>
          </Box>
        </Box>
        {copyright()}
      </Container>
    </ThemeProvider>
  );
}
