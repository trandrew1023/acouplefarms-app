import { React, useEffect, useState } from 'react';
import {
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLocation } from 'react-router-dom';
import AddLocationModal from './AddLocationModal';
import { getOrgLocations } from '../service';

export default function EditOrganization() {
  const { state } = useLocation();
  const [locations, setLocations] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  useEffect(async () => {
    const locationsResponse = await getOrgLocations(state.organization.id);
    setLocations(locationsResponse);
    console.log(locationsResponse);
  }, []);

  const addNewLocation = () => (
    <IconButton onClick={() => setLocationModalOpen(true)}>
      <AddCircleOutlineIcon fontSize="large" />
      Add location
    </IconButton>
  );

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Typography
          variant="h3"
          sx={{ mt: 2 }}
        >
          {state.organization.name}
        </Typography>
      </Grid>
      {(locations && locations.length > 0) ? (
        locations.map((location) => (
          <Typography key={location.id}>{location.name}</Typography>
        ))
      ) : (
        <Typography>
          This organization has no locations. Add a location to get started.
        </Typography>
      )}
      <Grid item xs={12}>
        {addNewLocation()}
      </Grid>
      {locationModalOpen
        && (
          <AddLocationModal
            organization={state.organization}
            locationModalOpen
            setLocationModalOpen={setLocationModalOpen}
            setLocations={setLocations}
          />
        )}
    </Grid>
  );
}
