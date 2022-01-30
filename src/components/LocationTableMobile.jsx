import { React, useState, useEffect } from 'react';
import {
  Grid,
} from '@mui/material';
import PropTypes from 'prop-types';
import LocationRowMobile from './LocationRowMobile';

export default function LocationTableMobile({ columns, rows }) {
  const [editableRows, setEditableRows] = useState([...rows]);

  useEffect(() => {
    setEditableRows(editableRows);
  });

  const onRowSave = (row, rowId) => {
    editableRows[rowId] = row;
    setEditableRows([...editableRows]);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="bottom"
      justifyContent="center"
    >
      {editableRows.map((row, index) => (
        <LocationRowMobile
          key={row.name}
          columns={columns}
          row={Object.assign(row, { id: index })}
          onRowSave={onRowSave}
        />
      ))}
    </Grid>
  );
}

LocationTableMobile.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.instanceOf(Map),
    history: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      data: PropTypes.instanceOf(Map),
    })),
    editMode: PropTypes.bool,
  })).isRequired,
};
