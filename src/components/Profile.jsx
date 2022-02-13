import { React, useEffect, useState } from 'react';
import {
  Avatar,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import {
  getUser,
} from '../service';

export default function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  useEffect(async () => {
    document.title = 'Profile - aCOUPlefarms';
    const userDetailsResponse = await getUser();
    if (userDetailsResponse) {
      setUserDetails(userDetailsResponse);
    } else {
      setUserDetails(null);
    }
  }, []);

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  return (
    userDetails ? (
      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: stringToColor(userDetails.username),
              }}
            >
              <Typography variant="h3">
                {userDetails.firstname.charAt(0).toUpperCase()}
                {userDetails.lastname.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
          </Grid>
          <Typography variant="h4">
            {userDetails.firstname}
            {' '}
            {userDetails.lastname}
          </Typography>
          <Typography variant="h5">Username</Typography>
          {userDetails.username}
          <Typography variant="h5">Email</Typography>
          {userDetails.email}
        </Grid>
      </Container>
    ) : null
  );
}
