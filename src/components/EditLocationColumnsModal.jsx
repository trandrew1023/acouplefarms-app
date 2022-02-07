import { React, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import { green, red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { getOrgLocationColumns, saveLocationColumn } from '../service';

export default function EditLocationColumnsModal({
  organization,
  locationColumnModalOpen,
  setLocationColumnModalOpen,
}) {
  const [locationColumns, setLocationColumns] = useState(null);
  const [locationColumnDetails, setLocationColumnDetails] = useState({
    name: '',
  });
  const [addColumn, setAddColumn] = useState(false);
  const [nameTaken, setNameTaken] = useState(false);
  const [errors, setErrors] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sortColumns = (columnsToSort) => (
    columnsToSort.sort((a, b) => (
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    ))
  );

  useEffect(async () => {
    const locationColumnsResponse = await getOrgLocationColumns(organization.id);
    sortColumns(locationColumnsResponse);
    setLocationColumns(locationColumnsResponse);
  }, []);

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

  const clearForm = () => {
    setErrors(null);
    setLocationColumnDetails({
      name: '',
    });
  };

  const handleFormChange = (prop) => (event) => {
    setSuccess(false);
    setLocationColumnDetails({ ...locationColumnDetails, [prop]: event.target.value });
  };

  /**
   * Checks form for invalid fields.
   */
  const hasErrors = () => {
    let hasError = false;
    setErrors(null);
    if (!locationColumnDetails.name) {
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
    const response = await saveLocationColumn(locationColumnDetails, organization.id);
    if (response.status === 204) {
      setLocationColumns(await getOrgLocationColumns(organization.id));
      clearForm();
      setSuccess(true);
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
        Column is already used at this organization
      </Typography>
    </Grid>
  );

  const addLocationColumnButton = () => (
    <>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <IconButton onClick={() => setAddColumn(true)}>
            <AddCircleOutlineIcon fontSize="large" />
            Add column
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mt: 1,
      }}
      >
        <Button variant="contained" onClick={() => setLocationColumnModalOpen(false)}>
          <Typography>Done</Typography>
        </Button>
      </Box>
    </>
  );

  const addLocationColumn = () => (
    <Grid container sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <TextField
          name="columnName"
          required
          fullWidth
          id="columnName"
          label="Column Name"
          autoFocus
          value={locationColumnDetails.name}
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
              onClick={() => setAddColumn(false)}
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
            {success ? <CheckIcon /> : <Typography>Add</Typography>}
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
      open={locationColumnModalOpen}
      onClose={() => setLocationColumnModalOpen(false)}
    >
      <Box component="form" sx={style}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5">
              Columns
            </Typography>
          </Grid>
          {locationColumns && locationColumns.length > 0 ? (
            locationColumns.map((locationColumn) => (
              <Grid key={locationColumn.id} item xs={12}>
                <Typography>
                  {locationColumn.name}
                </Typography>
              </Grid>
            ))
          ) : (
            <Typography>Add location columns to begin tracking in this organization</Typography>
          )}
        </Grid>
        {addColumn ? addLocationColumn() : addLocationColumnButton()}
      </Box>
    </Modal>
  );
}

EditLocationColumnsModal.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  locationColumnModalOpen: PropTypes.bool.isRequired,
  setLocationColumnModalOpen: PropTypes.func.isRequired,
};
