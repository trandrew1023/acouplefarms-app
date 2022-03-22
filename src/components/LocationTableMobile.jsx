import { React } from 'react';
import {
  Grid, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import LocationRowMobile from './LocationRowMobile';

export default function LocationTableMobile({
  columns,
  rows,
  setOrgLocationStats,
  setSuccess,
}) {
  const onRowChange = (row, rowId) => {
    setSuccess(false);
    /* eslint-disable no-param-reassign */
    rows[rowId] = row;
    setOrgLocationStats(rows);
  };

  const getRows = () => (
    rows && rows.map((row, index) => (
      <LocationRowMobile
        key={row.locationStatId}
        columns={columns}
        row={Object.assign(row, { id: index })}
        onRowChange={onRowChange}
      />
    ))
  );

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        maxWidth: '100vw',
      }}
    >
      {(columns && columns.length > 0)
        ? getRows()
        : (
          <Grid item xs={12} sx={{ mt: 1, width: '90vw' }}>
            <Typography>
              No columns defined in this organization.
              Please have an admin configure this organization.
            </Typography>
          </Grid>
        )}
    </Grid>
  );
}

LocationTableMobile.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    name: PropTypes.string,
  })),
  rows: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.instanceOf(Map),
    history: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      data: PropTypes.instanceOf(Map),
    })),
    editMode: PropTypes.bool,
  })),
  setOrgLocationStats: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
};

LocationTableMobile.defaultProps = {
  columns: null,
  rows: null,
};
