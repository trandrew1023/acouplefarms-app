import { React } from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function OrganizationCard({ organizationDetails }) {
  const navigate = useNavigate();
  return (
    organizationDetails.active
    && (
      <Card
        sx={{
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
            cursor: 'pointer',
          },
          mt: 1,
        }}
        onClick={() => navigate('/locations', { state: { organizationDetails } })}
        variant="outlined"
      >
        <CardContent>
          <Typography>
            {organizationDetails.name}
          </Typography>
        </CardContent>
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
    active: PropTypes.bool,
  }).isRequired,
};
