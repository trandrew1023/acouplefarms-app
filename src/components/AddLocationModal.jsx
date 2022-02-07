import { React, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { getOrgLocations, saveLocation } from '../service';

export default function AddLocationModal({
  organization,
  locationModalOpen,
  setLocationModalOpen,
  setLocations,
}) {
  const [locationDetails, setLocationDetails] = useState({
    name: '',
  });
  const [errors, setErrors] = useState(null);
  const [nameTaken, setNameTaken] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: red[500],
      },
    },
  });

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

  const handleFormChange = (prop) => (event) => {
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

  /**
   * Handles form submission.
   */
  const handleSubmit = async () => {
    if (hasErrors()) {
      return;
    }
    const response = await saveLocation(locationDetails, organization.id);
    if (response.status === 204) {
      setLocationModalOpen(false);
      setLocations(await getOrgLocations(organization.id));
    } else if (response.status === 400) {
      setErrors((prevErrors) => ({ ...prevErrors, badParam: true }));
    } else if (response.status === 409) {
      setNameTaken(true);
    }
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
   * Renders message if the name is already being used for this org.
   */
  const nameTakenMessage = () => (
    <Grid item xs={12}>
      <Typography variant="body1" color="red">
        Name is already used at this organization
      </Typography>
    </Grid>
  );

  return (
    <Modal
      open={locationModalOpen}
      onClose={() => setLocationModalOpen(false)}
    >
      <Box component="form" sx={style}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Add a new location
            </Typography>
          </Grid>
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
        </Grid>
        {errors && invalidFieldsMessage()}
        {nameTaken && nameTakenMessage()}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 1,
        }}
        >
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              onClick={() => setLocationModalOpen(false)}
              sx={{ mr: 1 }}
            >
              <Typography>Cancel</Typography>
            </Button>
          </ThemeProvider>
          <Button variant="contained" onClick={() => handleSubmit()}>
            <Typography>Submit</Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

AddLocationModal.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  locationModalOpen: PropTypes.bool.isRequired,
  setLocationModalOpen: PropTypes.func.isRequired,
  setLocations: PropTypes.func.isRequired,
};
