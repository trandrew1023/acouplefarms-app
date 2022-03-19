import { React, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailValidator from 'email-validator';
import { emailResetPassword } from '../service';
import logo from '../images/hen.png';

export default function ForgotPassword() {
  const [passwordResetForm, setPasswordResetForm] = useState({
    username: '',
  });
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [hasUsernameError, setUsernameError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasSubmitError, setSubmitError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = createTheme();
  const handleFormChange = (prop) => (event) => {
    setPasswordResetForm({ ...passwordResetForm, [prop]: event.target.value });
  };

  useEffect(() => {
    document.title = 'Forgot Password - aCOUPlefarms';
  });

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

  const hasErrors = () => {
    let hasError = false;
    setUsernameError(false);
    setInvalidUsername(false);
    if (!passwordResetForm.username) {
      hasError = true;
      setUsernameError(true);
      setIsLoading(false);
    }
    setSubmitError(hasError);
    return hasError;
  };

  const handleResetPassword = async () => {
    setSubmitSuccess(false);
    setIsLoading(true);
    if (hasErrors()) {
      return;
    }
    let response = '';
    if (EmailValidator.validate(passwordResetForm.username)) {
      response = await emailResetPassword('', passwordResetForm.username);
    } else {
      response = await emailResetPassword(passwordResetForm.username, '');
    }
    if (response.status === 204) {
      setPasswordResetForm({ username: '' });
      setSubmitSuccess(true);
    } else if (response.status === 404) {
      setInvalidUsername(true);
    }
    setIsLoading(false);
  };

  const handleKeypress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      handleResetPassword();
    }
  };

  const notFoundMessage = () => (
    <Typography variant="body1" color="red">
      The username or email entered does not exist
    </Typography>
  );

  const invalidFieldsMessage = () => (
    <Typography variant="body1" color="red">
      Please enter an email or username
    </Typography>
  );

  const emailSentMessage = () => (
    <Typography variant="body1" color="blue">
      An email has been sent. Please check your inbox to reset your password
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
            width: '100%',
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: 'primary' }}
            src={logo}
            variant="rounded"
          />
          <Typography component="h1" variant="h5">
            Forgot password
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email / Username"
              name="username"
              error={hasUsernameError}
              onChange={handleFormChange('username')}
              onKeyPress={handleKeypress}
            />
            {invalidUsername && notFoundMessage()}
            {hasSubmitError && invalidFieldsMessage()}
            {submitSuccess && emailSentMessage()}
            <Button
              fullWidth
              disabled={submitSuccess || isLoading}
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
            <Grid
              container
              justifyContent="right"
            >
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
