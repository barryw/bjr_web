import axios from 'axios';

/*
Configure Axios to pass along our CSRF token
*/
export const configureAxios = () => {
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  axios.defaults.headers.common['X-CSRF-Token'] = token;
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
}
