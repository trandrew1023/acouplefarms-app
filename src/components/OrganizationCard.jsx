import { React } from 'react';
import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function OrganizationCard({ organizationDetails }) {
  const navigate = useNavigate();

  return (
    organizationDetails.active
    && (
      <Card
        sx={{
          mt: 1,
          width: '90%',
          maxWidth: 500,
          bgcolor: 'secondary.main',
        }}
        variant="outlined"
        display="flex"
      >
        <Grid
          container
          alignItems="center"
        >
          <Grid item xs={organizationDetails.admin ? 8 : 10}>
            <CardActionArea
              onClick={() => navigate('/locations', { state: { organizationDetails } })}
            >
              <CardContent>
                <Typography variant="h6" noWrap>
                  {organizationDetails.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Grid>
          <Grid item xs={2}>
            <CardActions>
              <IconButton onClick={() => navigate('/line-chart', { state: { organization: organizationDetails } })}>
                <QueryStatsIcon />
              </IconButton>
            </CardActions>
          </Grid>
          <Grid item xs={2}>
            {organizationDetails.admin
              && (
                <CardActions>
                  <IconButton onClick={() => navigate('/edit-organization', { state: { organization: organizationDetails } })}>
                    <EditIcon />
                  </IconButton>
                </CardActions>
              )}
          </Grid>
        </Grid>
      </Card>
    )
  );
}

OrganizationCard.propTypes = {
  organizationDetails: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    nameKey: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    createDate: PropTypes.string,
    updateDate: PropTypes.string,
    admin: PropTypes.bool,
    active: PropTypes.bool,
  }).isRequired,
};
