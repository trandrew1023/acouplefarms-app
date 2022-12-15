import { React, useState } from 'react';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicDatePicker from './BasicDatePicker';
import LocationTable from './LocationTable';
import LocationTableMobile from './LocationTableMobile';

export default function Locations() {
  const [open, setOpen] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const createData = (name, a, b) => {
    const mainData = new Map();
    mainData.set(1, a);
    mainData.set(2, b);
    const historyData1 = new Map();
    historyData1.set(1, a + 1);
    historyData1.set(2, b + 1);
    const historyData2 = new Map();
    historyData2.set(1, a + 2);
    historyData2.set(2, b + 2);

    return ({
      name,
      data: mainData,
      history: [
        {
          date: '2020-01-01',
          data: historyData1,
        },
        {
          date: '2020-01-02',
          data: historyData2,
        },
      ],
      editMode: false,
    });
  };

  // temp data
  const columns = [
    {
      key: 1,
      name: 'Column A',
    },
    {
      key: 2,
      name: 'Column B',
    },
  ];

  const rows = [
    createData('Coop A', '1', '2'),
    createData('Coop B', '3', '4'),
    createData('Coop C', '5', '6'),
    createData('Coop D', '7', '8'),
    createData('Coop E', '9', '10'),
  ];

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

  const getLocationtable = () => {
    if (window.innerWidth > 485) {
      return (
        <LocationTable columns={columns} rows={rows} />
      );
    }
    return <LocationTableMobile columns={columns} rows={rows} />;
  };

  const handleCancel = () => {
    setOpen(true);
  };

  const handleSave = () => {
    console.log('ON SAVE');
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
        <BasicDatePicker />
      </Grid>
      <Grid item xs={12}>
        {getLocationtable()}
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <IconButton onClick={() => handleCancel()}>
          <Typography sx={{ mr: 1 }}>Cancel</Typography>
          <CancelPresentationIcon sx={{ mr: 3 }} />
        </IconButton>
        <IconButton onClick={() => handleSave()}>
          <Typography sx={{ mr: 1 }}>Save</Typography>
          <SaveIcon />
        </IconButton>
      </Grid>
      {open && cancelModal()}
    </Grid>
  );
}
