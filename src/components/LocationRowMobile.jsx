import { React, useState } from 'react';
import {
  Grid,
  Input,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function LocationRowMobile(props) {
  const {
    columns, row, onRowSave,
  } = props;
  const [rowDetails, setRowDetails] = useState({ data: new Map(row.data), editMode: row.editMode });

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

  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleRowSave();
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        align="center"
      >
        {row.name}
      </Typography>
      {columns.map((column) => (
        <Grid
          key={column.key}
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
              disableUnderline
              onKeyPress={handleKeypress}
              value={rowDetails.data.get(column.key)}
              onChange={editRowDetails(column.key)}
            />
          </Grid>
        </Grid>
      ))}
    </>
  );
}

LocationRowMobile.propTypes = {
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
