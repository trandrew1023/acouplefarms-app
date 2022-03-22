import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
  Switch,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLocation } from 'react-router-dom';
import AddLocationModal from './AddLocationModal';
import EditLocationColumnsModal from './EditLocationColumnsModal';
import EditLocationModal from './EditLocatonModal';
import LocationCard from './LocationCard';
import UserOrgAssociationModal from './UserOrgAssociationModal';
import { getOrgLocations } from '../service';

export default function EditOrganization() {
  const { state } = useLocation();
  const [locations, setLocations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    document.title = `Edit - ${state.organization.name} - aCOUPlefarms`;
    window.scrollTo(0, 0);
    const locationsResponse = await getOrgLocations(state.organization.id);
    sortLocations(locationsResponse);
    setLocations(locationsResponse);
    setIsLoading(false);
  }, []);

  const addNewLocation = () => (
    <Button
      startIcon={<AddCircleOutlineIcon />}
      variant="contained"
      onClick={() => setLocationModalOpen(true)}
      sx={{
        width: '90%',
        maxWidth: 500,
        mt: 2,
      }}
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
      sx={{
        width: '90%',
        maxWidth: 500,
        mt: 2,
      }}
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
      sx={{
        width: '90%',
        maxWidth: 500,
        mt: 2,
        mb: 5,
      }}
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

  const noLocations = () => (
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
  );

  const flockTrackingToggle = () => (
    <>
      <Grid item xs={4}>
        <Typography
          sx={{
            ml: 0,
          }}
        >
          Flock Tracking (disabled)
        </Typography>
      </Grid>
      <Tooltip title="Toggle flock tracking">
        <Grid item xs={1}>
          <Switch
            checked={false}
          />
        </Grid>
      </Tooltip>
    </>
  );

  const locationCards = () => (
    <>
      <>
        <Typography variant="h4">
          Locations
        </Typography>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            editLocation={editLocation}
          />
        ))}
      </>
      {addNewLocation()}
      {editLocationColumns()}
      {editUsers()}
      {flockTrackingToggle()}
    </>
  );

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {
          isLoading ? <CircularProgress sx={{ color: 'primary.loading' }} />
            : (
              <>
                <Grid item>
                  <Typography
                    variant="h3"
                    sx={{
                      mt: '70px',
                    }}
                  >
                    {state.organization.name}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {(locations && locations.length > 0) ? (
                    locationCards()
                  ) : (
                    noLocations()
                  )}
                </Grid>
              </>
            )
        }
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
    </Box>
  );
}
