import { React, useState, useEffect } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import LocationRow from './LocationRow';

export default function LocationTable({ columns, rows }) {
  const [editableRows, setEditableRows] = useState([...rows]);

  useEffect(() => {
    setEditableRows(editableRows);
  });

  const onRowSave = (row, rowId) => {
    editableRows[rowId] = row;
    setEditableRows([...editableRows]);
  };

  const getColumnHeader = (columnName) => (
    <TableCell key={columnName}>
      <Typography variant="h5">
        {columnName}
      </Typography>
    </TableCell>
  );

  return (
    <Grid item xs={12}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell><Typography variant="h5">Location</Typography></TableCell>
            {columns.map((column) => getColumnHeader(column.name))}
          </TableRow>
        </TableHead>
        <TableBody>
          {editableRows.map((row, index) => (
            <LocationRow
              key={row.name}
              columns={columns}
              row={Object.assign(row, { id: index })}
              onRowSave={onRowSave}
            />
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
}

LocationTable.propTypes = {
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
