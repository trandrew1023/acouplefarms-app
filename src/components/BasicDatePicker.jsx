import { React } from 'react';
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
import PropTypes from 'prop-types';

export default function BasicDatePicker({ date, changeDate }) {
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
              value={date.value}
              onChange={(newValue) => {
                console.log(newValue);
                changeDate({ value: newValue });
              }}
              /* eslint-disable react/jsx-props-no-spreading */
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={() => {
            const newDate = new Date(date.value);
            newDate.setDate(newDate.getDate() - 1);
            changeDate({ value: newDate });
          }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={() => {
            const newDate = new Date(date.value);
            newDate.setDate(newDate.getDate() + 1);
            changeDate({ value: newDate });
          }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
}

BasicDatePicker.propTypes = {
  date: PropTypes.shape({
    value: PropTypes.instanceOf(Date),
  }).isRequired,
  changeDate: PropTypes.func.isRequired,
};
