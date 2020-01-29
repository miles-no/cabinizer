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
      clientId="611538057711-dia11nhabvku7cgd0edubeupju1jf4rg.apps.googleusercontent.com"
      hostedDomain="miles.no"
      buttonText="Login"
      onSuccess={loginSuccess}
      onFailure={loginFailed}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default Login;
