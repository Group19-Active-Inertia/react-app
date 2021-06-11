import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../appContextProvider';
import {ROLES, ALLOWED_ADD_USER_TYPES} from '../constants/constants';
import { addUserApi } from '../api';
import Select from 'react-select';
import './Dashboard.css';

const AddUser = ({onSuccess, nerus}) => {
      const [email, setEmail] = useState();
      const [password, setPassword] = useState();
      const [userType, setUserType] = useState();
      const { user } = useContext(AppContext);
      const [selectedSites, setSelectedSites] = useState([]);
      const addUser = async () => {
            await addUserApi(user.token, email, password, userType, selectedSites);
            setEmail('');
            setPassword('');
            setUserType('');
            onSuccess();
      }

      const sitesDisplayValues = useMemo(() => {            
            return nerus.map(neru => ({                  
                  value: neru.Name,                  
                  label: neru.Name,            
                  }));      
                  }, 
                  [nerus]);      
      
      const updateSelectedSites = (e) => {            
            setSelectedSites(Array.isArray(e) ? e.map(x => x.value) : []);    
              }



      if(user.userType != ROLES.ADMIN && user.userType != ROLES.SITE_MANAGER) {
            return (<></>);
      }
     
      return (
            <>
                  <p>Add a User</p>
                  <form>
                  <input type="email" name="email" placeholder="Email"
                        onChange={({ target: { value } }) => setEmail(value)} value={email} />
                  <input type="password" name="password" placeholder="Password"
                        onChange={({ target: { value } }) => setPassword(value)}
                        value={password} />
                  <select value={userType} onChange={({ target: { value } }) => setUserType(value)}>
                        {
                              ALLOWED_ADD_USER_TYPES[user.userType].map(userType => {
                                    return (
                                          <option value={userType}>{userType}</option>
                                    );
                              })
                        }
                  </select>
                  

                  <Select
                        className="dropdown"
                        placeholder="Select Sites"
                        value={sitesDisplayValues.filter(obj => selectedSites.includes(obj.value))} // set selected values
                        options={sitesDisplayValues} 
                        onChange={updateSelectedSites} 
                        isMulti
                        isClearable
                  />
                  
                  <button onClick={addUser}>Add</button>
                  </form>
            </>
      );
}

export default AddUser;