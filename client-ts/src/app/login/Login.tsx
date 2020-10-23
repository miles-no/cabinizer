import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';

function Login() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const loginSuccess = (response: any) => {
    console.log(response);
    setAccessToken(response.access_token);
    setProfile(response.profileObj);
  };

  const loginFailed = (response: any) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId="423929329131-cqp6guna0ue32r9pd7qoe32lgncm7u0a.apps.googleusercontent.com"
      hostedDomain="miles.no"
      buttonText="Login"
      onSuccess={loginSuccess}
      onFailure={loginFailed}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default Login;
