import { React, useEffect, useState } from 'react';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicDatePicker from './BasicDatePicker';
import LocationTable from './LocationTable';
import LocationTableMobile from './LocationTableMobile';
import {
  getOrgLocationColumns,
  getOrgLocationStats,
  saveOrganizationStats,
} from '../service';

export default function Locations() {
  const { state } = useLocation();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [date, setDate] = useState({
    value: new Date(),
  });
  const navigate = useNavigate();
  const [orgLocationStats, setOrgLocationStats] = useState(null);
  const [columns, setColumns] = useState(null);

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
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
    ml: 5,
  };

  const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;

  const sortColumns = (columnsToSort) => (
    columnsToSort.sort((a, b) => (
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    ))
  );

  const sortLocations = (locationsToSort) => (
    locationsToSort.sort((a, b) => (
      a.locationName.localeCompare(b.locationName, undefined, { numeric: true, sensitivity: 'base' })
    ))
  );

  const retrieveStats = async (statDate) => {
    const newDate = (new Date(statDate.value - timezoneOffset)).toISOString().split('T')[0];
    setIsLoading(true);
    const orgLocationStatsResponse = await getOrgLocationStats(
      state.organizationDetails.id,
      newDate,
    );
    const orgLocationColumnsResponse = await getOrgLocationColumns(state.organizationDetails.id);
    sortColumns(orgLocationColumnsResponse);
    sortLocations(orgLocationStatsResponse);
    setOrgLocationStats(orgLocationStatsResponse);
    setColumns(orgLocationColumnsResponse);
    setIsLoading(false);
  };

  useEffect(async () => {
    retrieveStats(date);
  }, []);

  const changeDate = async (newDate) => {
    setDate(newDate);
    retrieveStats(newDate);
  };

  const getLocationtable = () => {
    if (window.innerWidth > 485) {
      return (
        <LocationTable
          columns={columns}
          rows={orgLocationStats}
          setOrgLocationStats={setOrgLocationStats}
        />
      );
    }
    return (
      <LocationTableMobile
        columns={columns}
        rows={orgLocationStats}
        setOrgLocationStats={setOrgLocationStats}
        setSuccess={setSuccess}
      />
    );
  };

  const handleCancel = () => {
    setOpen(true);
  };

  // https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
  const replacer = (key, value) => {
    if (value instanceof Map) {
      return Object.fromEntries(value.entries());
    }
    if (key === 'id') {
      return undefined;
    }
    return value;
  };

  const reviver = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  };

  const sleep = (ms) => (
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms))
  );

  const handleSave = async () => {
    const mappedReplacedString = JSON.stringify(orgLocationStats, replacer);
    const formattedOrgLocationStats = JSON.parse(mappedReplacedString, reviver);
    setSuccess(false);
    setSaveLoading(true);
    const response = await saveOrganizationStats(
      state.organizationDetails.id,
      (new Date(date.value - timezoneOffset)).toISOString().split('T')[0],
      [...formattedOrgLocationStats],
    );
    await sleep(500);
    if (response.status === 200) {
      console.log('SAVE SUCCESS');
      setSuccess(true);
    }
    setSaveLoading(false);
  };

  const cancelModal = () => (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box sx={style}>
        <Typography variant="h6">
          Your changes will not be saved. Are you sure you want to cancel?
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 1,
        }}
        >
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mr: 1 }}
            >
              <Typography>Yes</Typography>
            </Button>
          </ThemeProvider>
          <Button variant="contained" onClick={() => setOpen(false)}>
            <Typography>No</Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const formButtons = () => (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mb: 3 }}
    >
      {/* <Grid item xs={3}>
        <Box>
          <ThemeProvider theme={theme}>
            <Button
              size="small"
              variant="contained"
              disabled={saveLoading}
              onClick={() => handleCancel()}
              sx={{ mr: 5 }}
            >
              Cancel
            </Button>
          </ThemeProvider>
        </Box>
      </Grid> */}
      <Grid item xs={6}>
        <ThemeProvider theme={theme}>
          <Fab
            aria-label="cancel"
            disabled={saveLoading}
            onClick={() => handleCancel()}
            color="primary"
            sx={{ mr: 5 }}
          >
            <CancelPresentationIcon />
          </Fab>
        </ThemeProvider>
      </Grid>
      {/* <Grid item xs={3}>
        <Box>
          <Button
            size="small"
            variant="contained"
            sx={buttonSx}
            disabled={saveLoading}
            onClick={() => handleSave()}
          >
            Save
            {saveLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Button>
        </Box>
      </Grid> */}
      <Grid item xs={6}>
        <Fab
          aria-label="save"
          color="primary"
          disabled={saveLoading}
          sx={buttonSx}
          onClick={() => handleSave()}
        >
          {success ? <CheckIcon /> : <SaveIcon />}
          {saveLoading && (
            <CircularProgress
              size={68}
              sx={{
                color: green[500],
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1,
              }}
            />
          )}
        </Fab>
      </Grid>
    </Grid>
  );

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        mt: 5,
        backgroundColor: 'primary',
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h3">{state.organizationDetails.name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <BasicDatePicker date={date} changeDate={changeDate} />
      </Grid>
      <Grid item xs={12}>
        {isLoading ? <CircularProgress /> : (columns && orgLocationStats && getLocationtable())}
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        {formButtons()}
      </Grid>
      {open && cancelModal()}
    </Grid>
  );
}
