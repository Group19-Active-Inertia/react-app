import React, {useContext} from 'react';
import {Route} from "react-router-dom";
import {AppContext} from "./appContextProvider";
import {Redirect} from "react-router";
import { LOGIN_PATH} from './constants/paths';

const PrivateRoute = ({component: Component, ...restProps}) => {
    const {user} = useContext(AppContext);
    
    return (<Route
        {...restProps}
        render={(props) => user.token ? (<Component {...props} />) : (<Redirect to={{pathname: LOGIN_PATH}}/>)}
    />);
}

export default PrivateRoute;
