import { React } from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function BasicDateRangePicker({ dateRange, setDateRange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="Start date"
        endText="End date"
        value={dateRange}
        onChange={(newDateRange) => {
          setDateRange(newDateRange);
        }}
        /* eslint-disable react/jsx-props-no-spreading */
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
}

BasicDateRangePicker.propTypes = {
  dateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  setDateRange: PropTypes.func.isRequired,
};
