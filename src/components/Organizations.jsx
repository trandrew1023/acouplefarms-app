import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import OrganizationCard from './OrganizationCard';
import { getUserOrganizations } from '../service';

export default function Organizations() {
  const [organizations, setOrganizations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const navigate = useNavigate();

  const sortOrgs = (organizationsToSort) => (
    organizationsToSort.sort((a, b) => (
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    ))
  );

  useEffect(async () => {
    document.title = 'Organizations - aCOUPlefarms';
    setIsLoading(true);
    setHasErrors(false);
    const organizationsResponse = await getUserOrganizations();
    setIsLoading(false);
    if (organizationsResponse || organizationsResponse.status === 200) {
      sortOrgs(organizationsResponse.data);
      setOrganizations(organizationsResponse.data);
      return;
    }
    setHasErrors(true);
  }, []);

  const getOrganizations = () => (
    organizations && organizations.length > 0 ? organizations.map((organization) => (
      organization.admin ? (
        <Grid
          alignItems="center"
          container
          key={organization.id}
        >
          <Grid item xs={10}>
            <OrganizationCard key={organization.id} organizationDetails={organization} />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => navigate('/edit-organization', { state: { organization } })}>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
        : (
          <Grid
            alignItems="center"
            container
            key={organization.id}
          >
            <Grid item xs={12}>
              <OrganizationCard key={organization.id} organizationDetails={organization} />
            </Grid>
          </Grid>
        )
    ))
      : (
        <Typography variant="h5" sx={{ mt: 1 }}>
          No associated organizations.
          {' '}
          <Link href="/new-organization">
            Create a new organization
          </Link>
          {' '}
          or ask an admin to add you to one.
        </Typography>
      ));

  return (
    <Container component="main" maxWidth="xs">
      <Grid
        container
        direction="row"
        sx={{
          marginTop: 8,
          alignItems: 'left',
          maxWidth: 500,
          backgroundColor: 'primary',
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h4">
            Organizations
          </Typography>
        </Grid>
        {hasErrors
          && (
            <Typography variant="h5" sx={{ mt: 1 }}>
              Unable to retrieve organizations. Please try again later.
            </Typography>
          )}
        {isLoading ? <CircularProgress /> : getOrganizations()}
      </Grid>
    </Container>
  );
}
