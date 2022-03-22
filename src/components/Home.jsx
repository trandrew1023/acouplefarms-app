import { React, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import coop from '../images/chicken-coop.png';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'aCOUPlefarms';
    AOS.init();
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
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Typography
            data-aos="fade-down"
            variant="h3"
            sx={{
              textAlign: 'center',
              fontFamily: 'Monospace',
              fontWeight: 'bold',
              mt: 12,
            }}
          >
            aCOUPlefarms
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            data-aos="fade-down"
            variant="h5"
            sx={{
              textAlign: 'center',
              fontFamily: 'Monospace',
            }}
          >
            Manage and Track Your Coop
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            data-aos="fade-down"
            variant="h5"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontFamily: 'Monospace',
            }}
          >
            (or a couple of them)
          </Typography>
        </Grid>
        <img
          data-aos="fade-up"
          alt="Chicken Coop"
          src={coop}
          width="50%"
          align="center"
        />
        <Grid item xs={12}>
          <Button
            data-aos="fade-up"
            position="fixed"
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              mt: 5,
              color: 'white',
              bgcolor: 'primary.button',
            }}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
