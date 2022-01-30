import { React, useState } from 'react';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';
import { searchUsersByUsername } from '../service';

export default function UserOrgAssociationForm({ orgFormDetails, setOrgFormDetails }) {
  const [searchKey, setSearchKey] = useState('');
  const [users, setUsers] = useState({
    searchUsers: [],
    selectedUsers: orgFormDetails.selectedUsers,
  });
  const [errors, setErrors] = useState(null);
  const handleFormChange = (event) => {
    setSearchKey(event.target.value);
  };

  const handleSearch = async () => {
    setErrors(null);
    const response = await searchUsersByUsername(searchKey);
    if (response && response.status === 200) {
      const usersResponse = response.data;
      if (usersResponse.length === 0) {
        setUsers({ ...users, searchUsers: [] });
        setErrors({ ...errors, noUsersFound: true });
      } else {
        setUsers({ ...users, searchUsers: [...usersResponse] });
      }
    }
  };

  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleSearch();
    }
  };

  const handleUserSelect = (selectedUser) => {
    if (selectedUser.id === orgFormDetails.user.id) return;
    const selectedUserIndex = users.selectedUsers.map((user) => user.id).indexOf(selectedUser.id);
    let newSelectedUsers = null;
    if (selectedUserIndex === -1) {
      newSelectedUsers = [...users.selectedUsers, selectedUser];
    } else {
      newSelectedUsers = users.selectedUsers;
      newSelectedUsers.splice(selectedUserIndex, 1);
    }
    setOrgFormDetails({ ...orgFormDetails, selectedUsers: newSelectedUsers });
    setUsers({ ...users, selectedUsers: newSelectedUsers });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Add additional users
      </Typography>
      <TextField
        onChange={handleFormChange}
        onKeyPress={handleKeypress}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
      {errors
        && errors.noUsersFound
        && (
          <Typography variant="body1" color="red">
            No users found
          </Typography>
        )}
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
          {(users.searchUsers && users.searchUsers.length > 0)
            ? users.searchUsers.map((selectedUser) => (
              <Card
                key={selectedUser.id}
                onClick={() => handleUserSelect(selectedUser)}
                sx={{ mt: 0.2, cursor: 'pointer' }}
              >
                <Checkbox
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={
                    users.selectedUsers.map((user) => user.id)
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
          {(users.selectedUsers && users.selectedUsers.length > 0)
            ? users.selectedUsers.map((selectedUser) => (
              <Card
                key={selectedUser.id}
                onClick={() => handleUserSelect(selectedUser)}
                sx={{ mt: 0.2, cursor: 'pointer' }}
              >
                <Checkbox
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={users.selectedUsers.indexOf(selectedUser) >= 0}
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
