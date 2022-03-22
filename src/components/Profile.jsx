import { React, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Grid,
  Input,
  Tooltip,
  Typography,
} from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  getProfileImage,
  getUser,
  saveProfileImage,
} from '../service';

/* eslint-disable react/prop-types */
export default function Profile({ profileImagesRef }) {
  const [userDetails, setUserDetails] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  useEffect(async () => {
    document.title = 'Profile - aCOUPlefarms';
    window.scrollTo(0, 0);
    const userDetailsResponse = await getUser();
    const profileImageResponse = await getProfileImage();
    if (userDetailsResponse) {
      setUserDetails(userDetailsResponse);
    } else {
      setUserDetails(null);
    }
    if (profileImageResponse.status === 200 && profileImageResponse.data.url) {
      setImageURL(profileImageResponse.data.url);
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

  const saveImage = async (url) => {
    const imageDetails = {
      url,
    };
    saveProfileImage(imageDetails);
  };

  return (
    userDetails ? (
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          height: '100vh',
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            item
            xs={12}
            sx={{
              mt: '80px',
            }}
          >
            <label htmlFor="upload-button">
              <Input
                accept="image/*"
                id="upload-button"
                type="file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    const newImageRef = ref(profileImagesRef, userDetails.username);
                    uploadBytes(newImageRef, file).then((response) => {
                      getDownloadURL(response.ref).then((url) => {
                        saveImage(url);
                        window.location.reload();
                      });
                    });
                  }
                }}
                sx={{
                  display: 'none',
                }}
              />
              <Tooltip title="Change profile image" placement="top">
                {imageURL ? (
                  <Avatar
                    alt="Profile image"
                    src={imageURL}
                    sx={{
                      width: 100,
                      height: 100,
                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: stringToColor(userDetails.username),
                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Typography variant="h3" sx={{ color: 'white' }}>
                      {userDetails.firstname.charAt(0).toUpperCase()}
                      {userDetails.lastname.charAt(0).toUpperCase()}
                    </Typography>
                  </Avatar>
                )}
              </Tooltip>
            </label>
          </Grid>
          <Typography variant="h4">
            {userDetails.firstname}
            {' '}
            {userDetails.lastname}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>Username</Typography>
          <Typography variant="body">{userDetails.username}</Typography>
          <Typography variant="h5">Email</Typography>
          <Typography variant="body">{userDetails.email}</Typography>
        </Grid>
      </Box>
    ) : null
  );
}
