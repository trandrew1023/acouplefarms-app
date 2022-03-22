import { React, useEffect } from 'react';
import {
  Box,
  Grid,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function Settings({ darkMode, setDarkMode }) {
  useEffect(() => {
    document.title = 'Settings - aCOUPlefarms';
    window.scrollTo(0, 0);
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Grid
        container
        direction="row"
        alignItems="left"
        justifyContent="center"
        sx={{
          ml: 'auto',
          mr: 'auto',
          maxWidth: 500,
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mt: '70px',
              mb: 1,
            }}
          >
            Settings
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography
            sx={{
              mt: 1,
              ml: 2,
            }}
          >
            Dark Theme
          </Typography>
        </Grid>
        <Tooltip title="Toggle dark theme">
          <Grid item xs={3}>
            <Switch
              checked={darkMode === 'dark'}
              onChange={() => setDarkMode(darkMode === 'dark' ? 'light' : 'dark')}
            />
          </Grid>
        </Tooltip>
      </Grid>
    </Box>
  );
}

Settings.propTypes = {
  darkMode: PropTypes.string.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};
