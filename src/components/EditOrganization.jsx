import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import AddLocationModal from './AddLocationModal';
import EditLocationColumnsModal from './EditLocationColumnsModal';
import { getOrgLocations } from '../service';

export default function EditOrganization() {
  const { state } = useLocation();
  const [locations, setLocations] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationColumnModalOpen, setLocationColumnModalOpen] = useState(false);

  useEffect(async () => {
    const locationsResponse = await getOrgLocations(state.organization.id);
    setLocations(locationsResponse);
  }, []);

  const addNewLocation = () => (
    <IconButton onClick={() => setLocationModalOpen(true)}>
      <AddCircleOutlineIcon fontSize="large" />
      Add location
    </IconButton>
  );

  const editLocationColumns = () => (
    <IconButton onClick={() => setLocationColumnModalOpen(true)}>
      <EditIcon fontSize="large" />
      Edit columns
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
        <>
          {locations.map((location) => (
            <Typography key={location.id}>{location.name}</Typography>
          ))}
          {addNewLocation()}
          {editLocationColumns()}
        </>
      ) : (
        <>
          <Typography>
            This organization has no locations. Add a location to get started.
          </Typography>
          {addNewLocation()}
        </>
      )}
      {locationModalOpen
        && (
          <AddLocationModal
            organization={state.organization}
            locationModalOpen
            setLocationModalOpen={setLocationModalOpen}
            setLocations={setLocations}
          />
        )}
      {locationColumnModalOpen && (
        <EditLocationColumnsModal
          organization={state.organization}
          locationColumnModalOpen
          setLocationColumnModalOpen={setLocationColumnModalOpen}
        />
      )}
    </Grid>
  );
}
