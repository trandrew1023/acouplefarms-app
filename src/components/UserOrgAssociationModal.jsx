import { React, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { green, red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { getOrgUsers, getUser, saveOrgUsers } from '../service';
import UserOrgAssociationForm from './UserOrgAssociationForm';

export default function UserOrgAssociationModal({
  organization,
  userOrgAssociationModalOpen,
  setUserOrgAssociationModalOpen,
}) {
  const [orgFormDetails, setOrgFormDetails] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
    width: '30%',
  };

  useEffect(async () => {
    const orgUsers = await getOrgUsers(organization.id);
    const user = await getUser();
    setOrgFormDetails({
      name: organization.name,
      email: organization.email,
      phoneNumber: organization.phoneNumber,
      searchUsers: [],
      selectedUsers: orgUsers,
      user,
    });
  }, []);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: '300px',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: red[500],
      },
    },
  });

  const sleep = (ms) => (
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms))
  );

  /**
   * Handles form submission.
   */
  const handleSubmit = async () => {
    setSaveLoading(true);
    setSuccess(false);
    const userIds = orgFormDetails.selectedUsers.map((selectedUser) => selectedUser.id);
    const response = await saveOrgUsers(
      organization.id,
      userIds,
    );
    await sleep(500);
    if (response.status === 204) {
      const orgUsers = await getOrgUsers(organization.id);
      setOrgFormDetails({ ...orgFormDetails, searchUsers: [], users: orgUsers });
      setSuccess(true);
    } else if (response.status === 400) {
      console.log('400');
    } else if (response.status === 409) {
      console.log('409');
    }
    setSaveLoading(false);
  };

  return (
    <Modal
      open={userOrgAssociationModalOpen}
      onClose={() => setUserOrgAssociationModalOpen(false)}
    >
      <Box component="form" sx={style}>
        {orgFormDetails && (
          <UserOrgAssociationForm
            orgFormDetails={orgFormDetails}
            setOrgFormDetails={setOrgFormDetails}
          />
        )}
        <Grid item xs={12}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 1,
          }}
          >
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                disabled={saveLoading}
                onClick={() => setUserOrgAssociationModalOpen(false)}
                sx={{ mr: 1, width: '30%' }}
              >
                <Typography>{success ? 'Done' : 'Cancel'}</Typography>
              </Button>
            </ThemeProvider>
            <Button
              aria-label="save"
              color="primary"
              variant="contained"
              disabled={saveLoading}
              sx={buttonSx}
              onClick={() => handleSubmit()}
            >
              {success ? <CheckIcon /> : <Typography>Submit</Typography>}
              {saveLoading && (
                <CircularProgress
                  size={30}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                  }}
                />
              )}
            </Button>
            {/* <Button variant="contained" onClick={() => handleSubmit()}>
              <Typography>Submit</Typography>
            </Button> */}
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
}

UserOrgAssociationModal.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
  userOrgAssociationModalOpen: PropTypes.bool.isRequired,
  setUserOrgAssociationModalOpen: PropTypes.func.isRequired,
};
