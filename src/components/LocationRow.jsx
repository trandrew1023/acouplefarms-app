import { React, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Input,
  Table,
  // TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';

export default function LocationRow(props) {
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

  const [open, setOpen] = useState(false);

  const editRowDetails = (id) => (event) => {
    rowDetails.data.set(id, event.target.value);
    setRowDetails({ ...rowDetails });
    onRowChange({ ...row, locationColumnIdToValue: rowDetails.data }, row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography>{row.locationName}</Typography>
        </TableCell>
        {columns.map((column) => (
          <TableCell key={column.id}>
            <Input
              placeholder="--"
              disableUnderline
              value={rowDetails.data.get(column.id.toString())}
              onChange={editRowDetails(column.id.toString())}
            />
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 5, paddingTop: 5 }} colSpan={5.5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={3}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="medium" aria-label="past-farm-data">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Date</TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Typography>
                          {column.name}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {/* <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell />
                      <TableCell>{historyRow.date}</TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          <Typography>
                            {historyRow.data.get(column.key)}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

LocationRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
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
  }).isRequired,
  onRowChange: PropTypes.func.isRequired,
};
