import { React, useState } from 'react';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';
import { searchUsersByUsername } from '../service';

export default function UserOrgAssociationForm({
  orgFormDetails,
  setOrgFormDetails,
}) {
  const [searchKey, setSearchKey] = useState('');
  const [errors, setErrors] = useState(null);
  const handleFormChange = (event) => {
    setSearchKey(event.target.value);
  };

  const handleSearch = async () => {
    setErrors(null);
    if (searchKey.length < 1) {
      setErrors({ invalidSearchKey: true });
      return;
    }
    const response = await searchUsersByUsername(searchKey);
    if (response && response.status === 200) {
      const usersResponse = response.data;
      setSearchKey('');
      if (usersResponse.length === 0) {
        setOrgFormDetails({ ...orgFormDetails, searchUsers: [] });
        setErrors({ ...errors, noUsersFound: true });
      } else {
        setOrgFormDetails({ ...orgFormDetails, searchUsers: [...usersResponse] });
      }
    }
  };

  const noUsersFoundMessage = () => (
    <Typography sx={{ color: 'red' }}>
      No users found
    </Typography>
  );

  const noSearchKeyMessage = () => (
    <Typography sx={{ color: 'red' }}>
      Please enter a name to search
    </Typography>
  );

  const handleKeypress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleUserSelect = (selectedUser) => {
    if (selectedUser.id === orgFormDetails.user.id) return;
    const selectedUserIndex = orgFormDetails.selectedUsers.map(
      (user) => user.id,
    ).indexOf(selectedUser.id);
    let newSelectedUsers = null;
    if (selectedUserIndex === -1) {
      newSelectedUsers = [...orgFormDetails.selectedUsers, selectedUser];
    } else {
      newSelectedUsers = orgFormDetails.selectedUsers;
      newSelectedUsers.splice(selectedUserIndex, 1);
    }
    setOrgFormDetails({ ...orgFormDetails, selectedUsers: newSelectedUsers });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Add additional users
      </Typography>
      <TextField
        value={searchKey}
        onChange={handleFormChange}
        onKeyPress={handleKeypress}
        placeholder="Search usernames"
        sx={{ width: '100%' }}
        InputProps={{
          endAdornment: (
            <>
              {searchKey.length > 0
                && (
                  <IconButton onClick={() => setSearchKey('')}>
                    <HighlightOffIcon />
                  </IconButton>
                )}
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </>
          ),
        }}
      />
      {errors
        && errors.noUsersFound
        && noUsersFoundMessage()}
      {errors
        && errors.invalidSearchKey
        && noSearchKeyMessage()}
      <>
        <Typography sx={{ mt: 1 }}>Users</Typography>
        <Box sx={{
          height: '150px',
          border: 1,
          overflow: 'auto',
          borderRadius: 1,
          width: '100%',
        }}
        >
          {(orgFormDetails.searchUsers && orgFormDetails.searchUsers.length > 0)
            ? orgFormDetails.searchUsers.map((selectedUser) => (
              <Card
                key={selectedUser.id}
                onClick={() => handleUserSelect(selectedUser)}
                sx={{ mt: 0.2, cursor: 'pointer' }}
              >
                <Checkbox
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={
                    orgFormDetails.selectedUsers.map((user) => user.id)
                      .indexOf(selectedUser.id) >= 0
                  }
                />
                <Typography variant="button" sx={{ ml: 1 }}>
                  {selectedUser.username}
                </Typography>
              </Card>
            ))
            : (
              <Typography variant="button" sx={{ ml: 1 }}>
                No users found
              </Typography>
            )}
        </Box>
      </>
      <>
        <Typography>Selected users</Typography>
        <Box sx={{
          height: '150px',
          border: 1,
          overflow: 'auto',
          borderRadius: 1,
          width: '100%',
        }}
        >
          {(orgFormDetails.selectedUsers && orgFormDetails.selectedUsers.length > 0)
            ? orgFormDetails.selectedUsers.map((selectedUser) => (
              <Card
                key={selectedUser.id}
                onClick={() => handleUserSelect(selectedUser)}
                sx={{ mt: 0.2, cursor: 'pointer' }}
              >
                <Checkbox
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={orgFormDetails.selectedUsers.indexOf(selectedUser) >= 0}
                />
                <Typography variant="button" sx={{ ml: 1 }}>
                  {selectedUser.username}
                </Typography>
              </Card>
            ))
            : (
              <Typography variant="button" sx={{ ml: 1 }}>
                No users selected
              </Typography>
            )}
        </Box>
      </>
    </>
  );
}

UserOrgAssociationForm.propTypes = {
  orgFormDetails: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    searchUsers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        firstname: PropTypes.string,
        lastmane: PropTypes.string,
        email: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
    selectedUsers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        firstname: PropTypes.string,
        lastmane: PropTypes.string,
        email: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
    user: PropTypes.shape({
      id: PropTypes.number,
      firstname: PropTypes.string,
      lastmane: PropTypes.string,
      email: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
  setOrgFormDetails: PropTypes.func.isRequired,
};
