import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import OrganizationCard from './OrganizationCard';
import { getUserOrganizations } from '../service';

export default function Organizations() {
  const [organizations, setOrganizations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

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
    } else {
      setHasErrors(true);
    }
  }, []);

  const getOrganizations = () => (
    organizations && organizations.length > 0 ? organizations.map((organization) => (
      organization.admin ? (
        <OrganizationCard key={organization.id} organizationDetails={organization} />
      )
        : (
          <OrganizationCard key={organization.id} organizationDetails={organization} />
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
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} sx={{ textAlign: 'center', mt: '70px' }}>
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
    </Box>
  );
}
