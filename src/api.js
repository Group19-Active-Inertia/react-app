import axios from 'axios';

const ajax = axios.create({
      baseURL: `http://neru-api.herokuapp.com`,
});

export const loginApi = (email, password) => {
      const payload = {email, password};
      return ajax.post('/weblogin', payload);
}

export const addUserApi = (token, email, password, userType, sites) => {
      const payload = {
            token,
            email,
            password,
            userType,
            sites,
      }
      return ajax.post('/accounts', payload);
}

export const getAllUsersApi = (token) => {
      return ajax.get('/accounts', {params: {token}});
}

export const removeUserApi = (token, userId) => {
      return ajax.delete('/accounts', {data: {token, uid: userId}});
}
