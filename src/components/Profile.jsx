import React from 'react';
import { Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function Profile({ userDetails }) {
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

Profile.propTypes = {
  userDetails: PropTypes.shape({
    username: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};
