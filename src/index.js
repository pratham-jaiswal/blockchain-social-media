import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './components/App';

ReactDOM.render(
    <React.StrictMode>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_ID}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
      
    </React.StrictMode>,
    document.getElementById('root')
);