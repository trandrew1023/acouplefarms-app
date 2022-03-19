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
import { editLocationColumn, getOrgLocationColumns } from '../service';

export default function EditColumnModal({
  column,
  setColumns,
  organizationId,
  editColumnModalOpen,
  setEditColumnModalOpen,
}) {
  const [columnDetails, setColumnDetails] = useState(column);
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
    setColumnDetails({ ...columnDetails, [prop]: event.target.value });
  };

  /**
   * Checks form for invalid fields.
   */
  const hasErrors = () => {
    let hasError = false;
    setErrors(null);
    if (!columnDetails.name) {
      hasError = true;
      setErrors((prevErrors) => ({ ...prevErrors, name: true }));
    }
    return hasError;
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = async () => {
    setSuccess(false);
    if (hasErrors()) {
      return;
    }
    setSaveLoading(true);
    const response = await editLocationColumn(columnDetails);
    if (response.status === 204) {
      setSuccess(true);
      setColumns(await getOrgLocationColumns(organizationId));
      setEditColumnModalOpen(false);
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
        Column already exists
      </Typography>
    </Grid>
  );

  const editLocationColumnModal = () => (
    <Grid container sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <TextField
          name="columnName"
          required
          fullWidth
          id="columnName"
          label="Column Name"
          autoFocus
          value={columnDetails.name}
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
              onClick={() => setEditColumnModalOpen(false)}
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
      open={editColumnModalOpen}
      onClose={() => setEditColumnModalOpen(false)}
    >
      <Box component="form" sx={style}>
        {editLocationColumnModal()}
      </Box>
    </Modal>
  );
}

EditColumnModal.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  setColumns: PropTypes.func.isRequired,
  organizationId: PropTypes.number.isRequired,
  editColumnModalOpen: PropTypes.bool.isRequired,
  setEditColumnModalOpen: PropTypes.func.isRequired,
};
