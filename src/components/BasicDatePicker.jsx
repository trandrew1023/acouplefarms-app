import { React, useState } from 'react';
import {
  Container,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default function BasicDatePicker() {
  const [state, setState] = useState({
    value: new Date(),
  });

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
      <Grid
        container
        direction="row"
        align="center"
        justify="center"
      >
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={state.value}
              onChange={(newValue) => {
                console.log(newValue);
                setState({ value: newValue });
              }}
              /* eslint-disable react/jsx-props-no-spreading */
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={() => {
            const newDate = new Date(state.value);
            newDate.setDate(newDate.getDate() - 1);
            setState({ value: newDate });
          }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={() => {
            const newDate = new Date(state.value);
            newDate.setDate(newDate.getDate() + 1);
            setState({ value: newDate });
          }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
}
