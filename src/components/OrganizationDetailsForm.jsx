import { React } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export default function OrganizationDetailsForm({
  orgFormDetails,
  setOrgFormDetails,
  errors,
  orgNameExists,
  handleKeypress,
}) {
  const handleFormChange = (prop) => (event) => {
    setOrgFormDetails({ ...orgFormDetails, [prop]: event.target.value });
  };

  const newOrgDetailsErrorMessage = () => (
    <Typography variant="body1" color="red">
      Please fill out required fields
    </Typography>
  );

  const orgNameExistsMessage = () => (
    <Typography variant="body1" color="red">
      This organization already exists
    </Typography>
  );

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Organization details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="orgName"
            name="orgName"
            label="Organization name"
            fullWidth
            error={orgNameExists || (errors && errors.name)}
            onChange={handleFormChange('name')}
            variant="standard"
            value={orgFormDetails.name}
            onKeyDown={handleKeypress}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="orgEmail"
            name="orgEmail"
            label="Email"
            fullWidth
            onChange={handleFormChange('email')}
            variant="standard"
            onKeyDown={handleKeypress}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="phoneNumber"
            name="phoneNumber"
            label="Phone number"
            fullWidth
            onChange={handleFormChange('phoneNumber')}
            variant="standard"
            onKeyDown={handleKeypress}
          />
        </Grid>
      </Grid>
      {errors && newOrgDetailsErrorMessage()}
      {orgNameExists && orgNameExistsMessage()}
    </>
  );
}

OrganizationDetailsForm.propTypes = {
  orgFormDetails: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
  setOrgFormDetails: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.bool,
  }),
  orgNameExists: PropTypes.bool.isRequired,
  handleKeypress: PropTypes.func.isRequired,
};

OrganizationDetailsForm.defaultProps = {
  errors: null,
};
