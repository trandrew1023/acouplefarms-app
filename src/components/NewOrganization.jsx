import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { checkOrgNameExists, getUser, saveOrganization } from '../service';
import OrganizationDetailsForm from './OrganizationDetailsForm';
import UserOrgAssociationForm from './UserOrgAssociationForm';

const steps = ['Organization details', 'Add additional users'];

export default function NewOrganization() {
  const [activeStep, setActiveStep] = useState(0);
  const [orgFormDetails, setOrgFormDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    searchUsers: [],
    selectedUsers: [],
    user: null,
  });
  const [errors, setErrors] = useState(null);
  const [orgNameExists, setOrgNameExists] = useState(false);
  const navigate = useNavigate();

  useEffect(async () => {
    document.title = 'Add New Organization - aCOUPlefarms';
    if (!orgFormDetails.user) {
      const currentUser = await getUser();
      setOrgFormDetails((orgFormDetailsState) => (
        { ...orgFormDetailsState, selectedUsers: [currentUser], user: currentUser }));
    }
  }, []);

  const clearErrors = () => {
    setErrors(null);
    setOrgNameExists(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <OrganizationDetailsForm
            orgFormDetails={orgFormDetails}
            setOrgFormDetails={setOrgFormDetails}
            errors={errors}
            orgNameExists={orgNameExists}
          />
        );
      case 1:
        return (
          <UserOrgAssociationForm
            orgFormDetails={orgFormDetails}
            setOrgFormDetails={setOrgFormDetails}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  };

  const handleNext = async () => {
    clearErrors();
    if (activeStep === steps.length - 1) {
      const selectedUserIds = orgFormDetails.selectedUsers
        .flatMap((selectedUser) => selectedUser.id);
      const response = await saveOrganization({
        ...orgFormDetails, selectedUsers: selectedUserIds,
      });
      if (response.status === 204) {
        navigate('/organizations');
      } else if (response.status === 409) {
        console.log('fail');
      }
    } else if (!orgFormDetails.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: true }));
    } else {
      const response = await checkOrgNameExists(orgFormDetails.name);
      if (response) {
        setOrgNameExists(true);
        return;
      }
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Paper
          sx={{
            pl: 2,
            pr: 2,
            width: '85%',
            maxWidth: 500,
            mt: '70px',
          }}
        >
          <Typography
            variant="h4"
            align="center"
          >
            Create a new organization
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Typography variant="h5" gutterBottom>
              Organization created
            </Typography>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{
                      height: 40,
                      mt: 3,
                      ml: 1,
                      bgcolor: 'red',
                    }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    height: 40,
                    mt: 3,
                    mb: 3,
                    ml: 1,
                    bgcolor: 'primary.button',
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Box>
  );
}

NewOrganization.propTypes = {
  tokens: PropTypes.shape({
    accessToken: PropTypes.string,
    refreshToken: PropTypes.string,
  }),
};

NewOrganization.defaultProps = {
  tokens: null,
};
