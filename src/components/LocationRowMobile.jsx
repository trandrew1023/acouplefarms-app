import { React, Fragment, useState } from 'react';
import {
  Grid,
  Input,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function LocationRowMobile(props) {
  const {
    columns, row, onRowChange,
  } = props;

  const getEmptyColumns = () => {
    const columnIdToValue = new Map();
    columns.map((column) => (
      columnIdToValue.set(column.id.toString(), '')
    ));
    return columnIdToValue;
  };

  const [rowDetails, setRowDetails] = useState({
    data: (row.locationColumnIdToValue && Object.keys(row.locationColumnIdToValue).length > 0)
      ? new Map(Object.entries(row.locationColumnIdToValue))
      : getEmptyColumns(),
  });

  const editRowDetails = (id) => (event) => {
    rowDetails.data.set(id, event.target.value);
    setRowDetails({ ...rowDetails });
    onRowChange({ ...row, locationColumnIdToValue: rowDetails.data }, row.id);
  };

  return (
    <>
      <Typography
        variant="h4"
        align="center"
      >
        {row.locationName}
      </Typography>
      {columns.map((column) => (
        <Grid
          key={column.id}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={4}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {column.name}
              :
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Input
              placeholder="--"
              disableUnderline
              value={rowDetails.data.get(column.id.toString())}
              onChange={editRowDetails(column.id.toString())}
            />
          </Grid>
        </Grid>
      ))}
    </>
  );
}

LocationRowMobile.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  row: PropTypes.shape({
    id: PropTypes.number,
    locationName: PropTypes.string,
    locationColumnIdToValue: PropTypes.objectOf(PropTypes.string),
    history: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      data: PropTypes.instanceOf(Map),
    })),
    editMode: PropTypes.bool,
  }).isRequired,
  onRowChange: PropTypes.func.isRequired,
};
