import { React, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types';

export default function LocationRow(props) {
  const {
    columns, row, onRowSave,
  } = props;
  const [rowDetails, setRowDetails] = useState({ data: new Map(row.data), editMode: row.editMode });
  const [open, setOpen] = useState(false);

  const editRowDetails = (id) => (event) => {
    rowDetails.data.set(id, event.target.value);
    setRowDetails({ ...rowDetails });
  };

  const handleRowEditChange = (save) => {
    if (save) {
      setRowDetails({ ...rowDetails, editMode: !rowDetails.editMode });
    } else {
      setRowDetails({ data: new Map(row.data), editMode: !rowDetails.editMode });
    }
  };

  const handleRowSave = () => {
    handleRowEditChange(true);
    onRowSave({ ...row, data: new Map(rowDetails.data) }, row.id);
  };

  const handleRowCancel = () => {
    handleRowEditChange(false);
  };

  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleRowSave();
    }
  };

  const getRowDetails = (columnKey) => (
    <TableCell key={columnKey}>
      <Input
        onKeyPress={handleKeypress}
        value={rowDetails.data.get(columnKey)}
        onChange={editRowDetails(columnKey)}
      />
    </TableCell>
  );

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
        {rowDetails.editMode ? (
          <>
            <TableCell>
              <Typography>
                {row.name}
              </Typography>
            </TableCell>
            {columns.map((column) => getRowDetails(column.key))}
          </>
        )
          : (
            <>
              <TableCell>
                <Typography>{row.name}</Typography>
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Typography>
                    {row.data.get(column.key)}
                  </Typography>
                </TableCell>
              ))}
            </>
          )}
        <TableCell>
          {rowDetails.editMode
            ? (
              <>
                <IconButton
                  aria-label="save"
                  onClick={() => handleRowSave()}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  aria-label="cancel"
                  onClick={() => handleRowCancel()}
                >
                  <CancelPresentationIcon />
                </IconButton>
              </>
            )
            : (
              <IconButton
                aria-label="edit"
                onClick={() => handleRowEditChange(false)}
              >
                <ModeEditIcon />
              </IconButton>
            )}
        </TableCell>
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
                      <TableCell key={column.key}>
                        <Typography>
                          {column.name}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
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
                </TableBody>
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
    name: PropTypes.string,
    data: PropTypes.instanceOf(Map),
    history: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      data: PropTypes.instanceOf(Map),
    })),
    editMode: PropTypes.bool,
  }).isRequired,
  onRowSave: PropTypes.func.isRequired,
};
