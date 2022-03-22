import { React, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Box,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,

} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailValidator from 'email-validator';
import { register } from '../service';
import logo from '../images/hen.png';

export default function SignUp() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState(null);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = createTheme();

  useEffect(() => {
    document.title = 'Register - aCOUPlefarms';
    window.scrollTo(0, 0);
  }, []);

  const clearErrors = () => {
    setErrors(null);
    setUsernameTaken(false);
    setEmailTaken(false);
  };

  const clearForm = () => {
    setUserDetails({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    });
    clearErrors();
  };

  const handleFormChange = (prop) => (event) => {
    setUserDetails({ ...userDetails, [prop]: event.target.value });
  };

  /**
   * Checks form for invalid fields.
   */
  const hasErrors = () => {
    let hasError = false;
    setErrors(null);
    if (!userDetails.username) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, username: true }));
    }
    if (!userDetails.password) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, password: true }));
    }
    if (!userDetails.firstname) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, firstname: true }));
    }
    if (!userDetails.lastname) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, lastname: true }));
    }
    if (!userDetails.email || !EmailValidator.validate(userDetails.email)) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, email: true }));
    }
    return hasError;
  };

  /**
   * Handles form submission.
   */
  const handleRegister = async () => {
    setSubmitSucceeded(false);
    clearErrors();
    if (hasErrors()) {
      return;
    }
    const response = await register(userDetails);
    if (response.status === 204) {
      clearForm();
      setSubmitSucceeded(true);
    } else if (response.status === 400) {
      setErrors((prevErrors) => ({ ...prevErrors, username: true }));
      setErrors((prevErrors) => ({ ...prevErrors, badParam: true }));
    } else if (response.status === 409) {
      if (response.data === 'username') {
        setUsernameTaken(true);
      } else if (response.data === 'email') {
        setEmailTaken(true);
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * Handles 'Enter' keypress to submit form.
   */
  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleRegister();
      e.target.blur();
    }
  };

  /**
   * Renders message if the username is taken.
   */
  const usernameTakenMessage = () => (
    <Grid item xs={12} mt={-2}>
      <Typography variant="body1" color="red">
        Username taken
      </Typography>
    </Grid>
  );

  /**
   * Renders message if the email is taken.
   */
  const emailTakenMessage = () => (
    <Grid item xs={12} mt={-2}>
      <Typography variant="body1" color="red">
        Email already in use
      </Typography>
    </Grid>
  );

  /**
   * Renders message if any fields are invalid.
   */
  const invalidFieldsMessage = () => (
    <Typography variant="body1" color="red">
      Invalid fields
    </Typography>
  );

  /**
   * Renders message if registration was successful.
   */
  const submitSucceededMessage = () => (
    <Typography variant="body1" color="blue">
      You have successfully registered. Please check your email to verify your account
    </Typography>
  );

  /**
   * Renders copyright for the form.
   */
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
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={userDetails.firstname}
                  error={errors && errors.firstname}
                  onChange={handleFormChange('firstname')}
                  onKeyPress={handleKeypress}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={userDetails.lastname}
                  autoComplete="family-name"
                  error={errors && errors.lastname}
                  onChange={handleFormChange('lastname')}
                  onKeyPress={handleKeypress}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={userDetails.email}
                  autoComplete="email"
                  error={emailTaken || (errors && errors.email)}
                  onChange={handleFormChange('email')}
                  onKeyPress={handleKeypress}
                />
              </Grid>
              {emailTaken && emailTakenMessage()}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={userDetails.username}
                  error={usernameTaken || (errors && errors.username)}
                  onChange={handleFormChange('username')}
                  onKeyPress={handleKeypress}
                />
              </Grid>
              {usernameTaken && usernameTakenMessage()}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={userDetails.password}
                  autoComplete="new-password"
                  error={errors && errors.password}
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
              </Grid>
            </Grid>
            {errors && invalidFieldsMessage()}
            {submitSucceeded && submitSucceededMessage()}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleRegister()}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
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
