import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Card,
  CardActions,
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
import UserOrgAssociationModal from './UserOrgAssociationModal';
import { getOrgLocations } from '../service';
import EditLocationModal from './EditLocatonModal';

export default function EditOrganization() {
  const { state } = useLocation();
  const [locations, setLocations] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editLocationModalOpen, setEditLocationModalOpen] = useState(false);
  const [locationColumnModalOpen, setLocationColumnModalOpen] = useState(false);
  const [userOrgAssociationModalOpen, setUserOrgAssociationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  const editLocation = (location) => {
    setEditLocationModalOpen(true);
    setSelectedLocation(location);
  };

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
      <Grid
        item
        sx={{
          width: window.innerWidth > 485 ? '50%' : '80%',
          mb: 3,
        }}
      >
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
            {locations.map((location) => (
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
            ))}
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
      {editLocationModalOpen && (
        <EditLocationModal
          location={selectedLocation}
          setLocations={setLocations}
          organizationId={state.organization.id}
          editLocationModalOpen={editLocationModalOpen}
          setEditLocationModalOpen={setEditLocationModalOpen}
        />
      )}
    </Grid>
  );
}
