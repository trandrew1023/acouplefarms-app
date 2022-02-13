import axios from 'axios';
import { History } from './components/NavigateSetter';

const headerKey = process.env.REACT_APP_HEADER_KEY;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const getTokensFromStorage = () => {
  const storageTokens = JSON.parse(localStorage.getItem('tokens'));
  return storageTokens;
};

export function refreshToken(tokens) {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}user/token/refresh`, {
    headers: {
      Authorization: headerKey + tokens.refresh_token,
    },
  }).then((response) => response)
    .catch((error) => error.response);
}

axiosInstance.interceptors.request.use((config) => {
  const tokens = getTokensFromStorage();
  if (tokens) {
    /* eslint-disable no-param-reassign */
    config.headers.Authorization = headerKey + tokens.access_token;
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    return config;
  }
  return config;
}, (error) => Promise.reject(error));

export function getUser() {
  return axiosInstance.get('user')
    .then((response) => response.data)
    .catch((error) => console.log(error));
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const tokens = getTokensFromStorage();
    if (tokens) {
      if (error.response.status === 401) {
        console.log('TOKENS EXPIRED');
        const response = await refreshToken(tokens);
        if (response.status === 200) {
          localStorage.setItem('tokens', JSON.stringify(response.data));
          console.log('SET NEW TOKENS');
          const userDetails = await getUser();
          localStorage.setItem('user', JSON.stringify(userDetails));
          error.config.headers.Authorization = headerKey + response.data.access_token;
          return axiosInstance.request(error.config);
        }
        if (response.status === 401) {
          localStorage.clear();
          console.log('need to sign in again');
          History.navigate('/login');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  },
);

export function login(loginDetails) {
  const params = new URLSearchParams();
  params.append('username', loginDetails.username);
  params.append('password', loginDetails.password);
  return axiosInstance.post('login', params)
    .then((response) => response.data)
    .catch((error) => console.log(error));
}

export function register(userDetails) {
  return axiosInstance.post('user', {
    username: userDetails.username,
    firstname: userDetails.firstname,
    lastname: userDetails.lastname,
    email: userDetails.email,
    password: userDetails.password,
  })
    .then((response) => response)
    .catch((error) => error.response);
}

export function emailResetPassword(username, email) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('email', email);
  return axiosInstance.post('user/email/reset-password', params)
    .then((response) => response)
    .catch((error) => error.response);
}

export function resetPassword(passwordResetCriteria) {
  return axiosInstance.post('user/reset-password', passwordResetCriteria)
    .then((response) => response)
    .catch((error) => console.log(error));
}

export function checkResetToken(token) {
  const params = new URLSearchParams();
  params.append('token', token);
  return axiosInstance.post('user/reset-token', params)
    .then((response) => response)
    .catch((error) => error.response);
}

export function getUserOrganizations() {
  return axiosInstance.get('user/organizations')
    .then((response) => response)
    .catch((error) => console.log(error));
}

export function saveOrganization(orgFormDetails) {
  return axiosInstance.post(
    'organization',
    {
      organization: {
        name: orgFormDetails.name,
        email: orgFormDetails.email,
        phoneNumber: orgFormDetails.phoneNumber,
      },
      userIds: orgFormDetails.selectedUsers,
    },
  )
    .then((response) => response)
    .catch((error) => error.response);
}

export function checkOrgNameExists(orgName) {
  return axiosInstance.get(`organization/${orgName}/check`)
    .then((response) => {
      if (response.status === 200) {
        return false;
      }
      if (response.status === 226) {
        return true;
      }
      return true;
    })
    .catch((error) => {
      console.log(error);
      return true;
    });
}

export function searchUsersByUsername(username) {
  return axiosInstance.get(`user/search/${username}`)
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function getOrgLocations(organizationId) {
  return axiosInstance.get(`organization/${organizationId}/locations`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function saveLocation(locationDetails, organizationId) {
  return axiosInstance.post('location', {
    name: locationDetails.name,
    organizationId,
  })
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function editLocation(locationDetails) {
  return axiosInstance.post('location/edit', locationDetails)
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function getOrgLocationColumns(organizationId) {
  return axiosInstance.get(`organization/${organizationId}/location-columns`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function saveLocationColumn(locationColumnDetails, organizationId) {
  return axiosInstance.post('organization/location-column', {
    name: locationColumnDetails.name,
    organizationId,
  })
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function editLocationColumn(locationColumnDetails) {
  return axiosInstance.post('organization/location-column/edit', locationColumnDetails)
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function getOrgLocationStats(organizationId, date) {
  return axiosInstance.get(`organization/${organizationId}/location-stats/${date}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function getOrgLocationStatsBetween(organizationId, startDate, endDate) {
  return axiosInstance.get(`organization/${organizationId}/location-stats/${startDate}/${endDate}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function saveOrganizationStats(organizationId, date, locationStatsCriteria) {
  return axiosInstance.post(`organization/${organizationId}/location-stats`, {
    date,
    locationStatsCriteria,
  })
    .then((response) => response)
    .catch((error) => {
      console.log(JSON.stringify(error));
      return error.response;
    });
}

export function getOrgUsers(organizationId) {
  return axiosInstance.get(`organization/${organizationId}/users`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function saveOrgUsers(organizationId, userIds) {
  console.log(organizationId);
  console.log(userIds);
  return axiosInstance.post('organization/users', {
    organizationId,
    userIds,
  })
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}
