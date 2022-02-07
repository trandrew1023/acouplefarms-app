import {
  Fragment,
  React,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Grid,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLocation } from 'react-router-dom';
import AddLocationModal from './AddLocationModal';
import EditLocationColumnsModal from './EditLocationColumnsModal';
import UserOrgAssociationModal from './UserOrgAssociationModal';
import { getOrgLocations } from '../service';

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
    document.title = `Edit - ${state.organization.name} - aCOUPlefarms`;
    const locationsResponse = await getOrgLocations(state.organization.id);
    sortLocations(locationsResponse);
    setLocations(locationsResponse);
  }, []);

  const renderLocations = (location) => (
    <Grid item xs={12}>
      <Typography
        variant="h5"
        key={location.id}
      >
        {location.name}
      </Typography>
    </Grid>
  );

  const addNewLocation = () => (
    <Button
      startIcon={<AddCircleOutlineIcon />}
      variant="contained"
      onClick={() => setLocationModalOpen(true)}
      sx={{ width: '60%', mt: 2 }}
    >
      <Typography variant="button">
        Add location
      </Typography>
    </Button>
  );

  const editLocationColumns = () => (
    <Button
      startIcon={<EditIcon />}
      variant="contained"
      onClick={() => setLocationColumnModalOpen(true)}
      sx={{ width: '60%', mt: 2 }}
    >
      <Typography variant="button">
        Edit columns
      </Typography>
    </Button>
  );

  const editUsers = () => (
    <Button
      startIcon={<PersonAddIcon />}
      variant="contained"
      onClick={() => setUserOrgAssociationModalOpen(true)}
      sx={{ width: '60%', mt: 2 }}
    >
      <Typography variant="button">
        Edit users
      </Typography>
    </Button>
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
      <Grid item sx={{ width: window.innerWidth > 485 ? '50%' : '80%' }}>
        {(locations && locations.length > 0) ? (
          <>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h4">
                Locations:
              </Typography>
            </Grid>
            <Grid
              container
              direction="column"
              alignItems="left"
              justifyContent="center"
              sx={{ mt: 1 }}
            >
              {locations.map((location) => (
                <Grid
                  key={location.id}
                  item
                  xs={12}
                >
                  {renderLocations(location)}
                </Grid>
              ))}
            </Grid>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              {addNewLocation()}
              {editLocationColumns()}
              {editUsers()}
            </Grid>
          </>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 1 }}
          >
            <Typography>
              This organization has no locations. Add a location to get started.
            </Typography>
            {addNewLocation()}
          </Grid>
        )}
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
