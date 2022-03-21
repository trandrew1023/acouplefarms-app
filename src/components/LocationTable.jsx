import { React } from 'react';
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

export default function LocationTable({
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

  const getColumnHeader = (columnName) => (
    <TableCell key={columnName}>
      <Typography variant="h5">
        {columnName}
      </Typography>
    </TableCell>
  );

  return (
    <Grid item xs={12}>
      {(columns && columns.length > 0)
        ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <Typography variant="h5">Location</Typography>
                </TableCell>
                {columns.map((column) => getColumnHeader(column.name))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.map((row, index) => (
                <LocationRow
                  key={row.locationStatId}
                  columns={columns}
                  row={Object.assign(row, { id: index })}
                  onRowChange={onRowChange}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography textAlign="center" sx={{ width: '90vw' }}>
            No columns defined in this organization.
            Please have an admin configure this organization.
          </Typography>
        )}
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
    locationColumnIdToValue: PropTypes.objectOf(PropTypes.string),
    history: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      data: PropTypes.instanceOf(Map),
    })),
    editMode: PropTypes.bool,
  })),
  setOrgLocationStats: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
};

LocationTable.defaultProps = {
  columns: null,
  rows: null,
};
