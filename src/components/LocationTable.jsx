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
  const [editableRows, setEditableRows] = useState(rows ? [...rows] : null);

  useEffect(() => {
    console.log('COLUMNS', columns);
    console.log('ROWS', rows);
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
            {(columns && columns.length > 0)
              ? (columns.map((column) => getColumnHeader(column.name)))
              : (
                <Typography>
                  No columns defined in this organization. Please add columns to the organization
                </Typography>
              )}
          </TableRow>
        </TableHead>
        <TableBody>
          {editableRows && editableRows.map((row, index) => (
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
};

LocationTable.defaultProps = {
  columns: null,
  rows: null,
};
