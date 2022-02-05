import { React, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
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

  useEffect(async () => {
    const orgUsers = await getOrgUsers(organization.id);
    const user = await getUser();
    setOrgFormDetails({
      name: organization.name,
      email: organization.email,
      phoneNumber: organization.phoneNumber,
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
    border: '2px solid #000',
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

  /**
   * Handles form submission.
   */
  const handleSubmit = async () => {
    const response = await saveOrgUsers(organization.id, orgFormDetails.selectedUsers);
    if (response.status === 204) {
      console.log('PASS');
    } else if (response.status === 400) {
      console.log('400');
    } else if (response.status === 409) {
      console.log('409');
    }
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
                onClick={() => setUserOrgAssociationModalOpen(false)}
                sx={{ mr: 1 }}
              >
                <Typography>Cancel</Typography>
              </Button>
            </ThemeProvider>
            <Button variant="contained" onClick={() => handleSubmit()}>
              <Typography>Submit</Typography>
            </Button>
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
