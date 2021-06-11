import React from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import './App.css';
import AppContextProvider from './appContextProvider';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <AppContextProvider>
      <div className="wrapper">
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/login" component={Login} />  
            <Route exact path="/" component={Login} />
          </Switch>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}

export default App;