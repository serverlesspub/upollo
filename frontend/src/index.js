import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';

import Amplify from 'aws-amplify';
Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_COGNITOUSERPOOLID,
    userPoolWebClientId: process.env.REACT_APP_COGNITOUSERPOOLCLIENTID,
    identityPoolId: process.env.REACT_APP_COGNITOIDENTITYPOOLID,
    mandatorySignIn: false,
  },
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_GRAPHQLENDPOINT,
  aws_appsync_region: process.env.REACT_APP_REGION,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: process.env.REACT_APP_APIKEY
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
