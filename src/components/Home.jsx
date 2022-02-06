import { React, useEffect } from 'react';
import {
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import coop from '../images/chicken-coop.png';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'aCOUPlefarms';
  });

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ mt: -4 }}
      spacing={5}
    >
      <Grid item xs={12}>
        <Typography
          variant="h2"
          sx={{ fontFamily: 'Monospace' }}
        >
          Manage and Track Your Farm
        </Typography>
      </Grid>
      <img
        alt="Chicken Coop"
        src={coop}
        width="50%"
        align="center"
      />
      <Grid item xs={12}>
        <Button
          position="fixed"
          variant="contained"
          onClick={() => navigate('/register')}
          sx={{ mb: 3 }}
        >
          Sign Up
        </Button>
      </Grid>
    </Grid>
  );
}
