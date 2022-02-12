import { React, useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
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

  return (
    userDetails ? (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4">Name</Typography>
        <Typography>
          {userDetails.lastname}
          ,
          {' '}
          {userDetails.firstname}
        </Typography>
        <Typography variant="h4">Username</Typography>
        {userDetails.username}
        <Typography variant="h4">Email</Typography>
        {userDetails.email}
      </Container>
    ) : null
  );
}
