import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', 
});

const token = localStorage.getItem('token');


apiClient.interceptors.request.use(config => {
    if (token) {
        config.headers['Authorization'] = token;
        console.log(token);  
    }
    else{
      console.log('No token found, redirecting to login...');
      window.location.href = '/login';
    }
    return config;
}, error => {
    return Promise.reject(error);
});


apiClient.get('/mobilephones')
  .then(response => {
    console.log('API Response:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });









