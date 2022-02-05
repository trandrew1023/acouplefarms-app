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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLocation } from 'react-router-dom';
import AddLocationModal from './AddLocationModal';
import EditLocationColumnsModal from './EditLocationColumnsModal';
import { getOrgLocations } from '../service';
import UserOrgAssociationModal from './UserOrgAssociationModal';

export default function EditOrganization() {
  const { state } = useLocation();
  const [locations, setLocations] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationColumnModalOpen, setLocationColumnModalOpen] = useState(false);
  const [userOrgAssociationModalOpen, setUserOrgAssociationModalOpen] = useState(false);

  const sortLocations = (locationsToSort) => (
    locationsToSort.sort((a, b) => (
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    ))
  );

  useEffect(async () => {
    const locationsResponse = await getOrgLocations(state.organization.id);
    sortLocations(locationsResponse);
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

  const editUsers = () => (
    <IconButton onClick={() => setUserOrgAssociationModalOpen(true)}>
      <PersonAddIcon fontSize="large" />
      Edit users
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
          {editUsers()}
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
      {userOrgAssociationModalOpen && (
        <UserOrgAssociationModal
          organization={state.organization}
          userOrgAssociationModalOpen={userOrgAssociationModalOpen}
          setUserOrgAssociationModalOpen={setUserOrgAssociationModalOpen}
        />
      )}
    </Grid>
  );
}
