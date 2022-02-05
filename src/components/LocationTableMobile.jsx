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
      alignItems="bottom"
      justifyContent="center"
    >
      {(columns && columns.length > 0)
        ? getRows()
        : (
          <Typography>
            No columns defined in this organization. Please add columns to the organization
          </Typography>
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
