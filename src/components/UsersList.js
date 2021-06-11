import React, { useState, useContext, useEffect, useCallback } from 'react';
import { getAllUsersApi, removeUserApi } from '../api';
import { enableRemoveOption } from '../utils';
import { AppContext } from '../appContextProvider';

const renderUser = (user, removeUser, loggedInUser) => {
      const sites = user.sites;
      return (
            <li key={user.ID}>
                  <h3>{user.email}</h3>
                  <p>User Type: {user.userType}</p>
                  <p>Sites: </p>

                  {sites.map((value, index) => {
                        return <li key={index}>{value}</li>
                  })}

                  {
                        enableRemoveOption(loggedInUser, sites) &&
                        <button onClick={() => removeUser(user.ID)}>Remove</button>
                  }
                  <br />
            </li>
      )
}
const mapToUsers = (users) => {
      const values = [];
      Object.entries(users).forEach(([key, value]) => {
            values.push({ ...value, ID: key });
      });
      return values;
};
const UsersList = ({ reload, onSuccessfulReload }) => {
      const [users, setUsers] = useState([]);
      const { user } = useContext(AppContext);

      const fetchUsers = useCallback(async () => {
            const { data } = await getAllUsersApi(user.token);
            setUsers(mapToUsers(data));
      }, [user.token]);

      const removeUser = useCallback(async (userId) => {
            await removeUserApi(user.token, userId);
            fetchUsers();
      }, [user.token]);

      useEffect(() => {
            fetchUsers();
      }, [fetchUsers]);

      console.log({ reload });
      useEffect(() => {
            if (!reload) {
                  return;
            }
            console.log('reloading');
            fetchUsers();
            onSuccessfulReload();
      }, [reload]);
      return (
            <>
                  <h2>Users</h2>
                  <div className="itemScroll">
                        <ul className="horizScroll">
                              {
                                    users.map((u) => renderUser(u, removeUser, user))
                              }
                        </ul>
                  </div>
            </>
      );
};

export default UsersList;


