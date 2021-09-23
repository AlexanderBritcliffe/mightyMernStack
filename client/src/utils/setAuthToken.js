import axios from 'axios';
//this function takes in a token if token is there it adds to header if not deletes it from header
//the token here would come from local storage

const setAuthToken = token => {
  if(token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;
