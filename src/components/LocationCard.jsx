import {
  React,
} from 'react';
import {
  Card,
  CardActions,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

export default function LocationCard({ location, editLocation }) {
  return (
    <Card
      key={location.id}
      sx={{
        mt: 1,
      }}
      variant="outlined"
      display="flex"
    >
      <Grid
        container
        alignItems="center"
      >
        <Grid
          key={location.id}
          item
          xs={10}
        >
          <Typography
            variant="h5"
            key={location.id}
            noWrap
          >
            {location.name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <CardActions>
            <IconButton
              onClick={() => editLocation(location)}
            >
              <EditIcon />
            </IconButton>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
}

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  editLocation: PropTypes.func.isRequired,
};
