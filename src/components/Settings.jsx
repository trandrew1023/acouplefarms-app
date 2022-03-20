import { React } from 'react';
import {
  Box,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function Settings({ darkMode, setDarkMode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mt: '70px',
            }}
          >
            Settings
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              mt: 1,
            }}
          >
            Dark Theme
          </Typography>
          <Grid item xs={9}>
            <Switch
              checked={darkMode === 'dark'}
              onChange={() => setDarkMode(darkMode === 'dark' ? 'light' : 'dark')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

Settings.propTypes = {
  darkMode: PropTypes.string.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};
