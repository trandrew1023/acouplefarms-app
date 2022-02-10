import { React, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { green, red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { editLocation, getOrgLocations } from '../service';

export default function EditLocationModal({
  location,
  setLocations,
  organizationId,
  editLocationModalOpen,
  setEditLocationModalOpen,
}) {
  const [locationDetails, setLocationDetails] = useState(location);
  const [nameTaken, setNameTaken] = useState(false);
  const [errors, setErrors] = useState(null);
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

  const handleFormChange = (prop) => (event) => {
    setSuccess(false);
    setLocationDetails({ ...locationDetails, [prop]: event.target.value });
  };

  /**
   * Checks form for invalid fields.
   */
  const hasErrors = () => {
    let hasError = false;
    setErrors(null);
    if (!locationDetails.name) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, name: true }));
    }
    return hasError;
  };

  const sleep = (ms) => (
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms))
  );

  /**
   * Handles form submission.
   */
  const handleSubmit = async () => {
    setSuccess(false);
    if (hasErrors()) {
      return;
    }
    setSaveLoading(true);
    await sleep(500);
    const response = await editLocation(locationDetails);
    if (response.status === 204) {
      setSuccess(true);
      setLocations(await getOrgLocations(organizationId));
      setEditLocationModalOpen(false);
    } else if (response.status === 400) {
      setErrors((prevErrors) => ({ ...prevErrors, badParam: true }));
    } else if (response.status === 409) {
      setNameTaken(true);
    }
    setSaveLoading(false);
  };

  /**
     * Handles 'Enter' keypress to submit form.
     */
  const handleKeypress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * Renders message if any fields are invalid.
   */
  const invalidFieldsMessage = () => (
    <Typography variant="body1" color="red">
      Invalid fields
    </Typography>
  );

  /**
   * Renders message if the column is already being used for this org.
   */
  const nameTakenMessage = () => (
    <Grid item xs={12}>
      <Typography variant="body1" color="red">
        Location already exists
      </Typography>
    </Grid>
  );

  const addLocationColumn = () => (
    <Grid container sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <TextField
          name="locationName"
          required
          fullWidth
          id="locationName"
          label="Location Name"
          autoFocus
          value={locationDetails.name}
          error={errors && errors.name}
          onChange={handleFormChange('name')}
          onKeyPress={handleKeypress}
        />
      </Grid>
      {errors && invalidFieldsMessage()}
      {nameTaken && nameTakenMessage()}
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
              disabled={saveLoading}
              onClick={() => setEditLocationModalOpen(false)}
              sx={{ mr: 1 }}
            >
              <Typography>Cancel</Typography>
            </Button>
          </ThemeProvider>
          <Button
            variant="contained"
            disabled={saveLoading}
            onClick={() => handleSubmit()}
            sx={buttonSx}
          >
            {success ? <CheckIcon /> : <Typography>Save</Typography>}
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
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Modal
      open={editLocationModalOpen}
      onClose={() => setEditLocationModalOpen(false)}
    >
      <Box component="form" sx={style}>
        {addLocationColumn()}
      </Box>
    </Modal>
  );
}

EditLocationModal.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  setLocations: PropTypes.func.isRequired,
  organizationId: PropTypes.number.isRequired,
  editLocationModalOpen: PropTypes.bool.isRequired,
  setEditLocationModalOpen: PropTypes.func.isRequired,
};
