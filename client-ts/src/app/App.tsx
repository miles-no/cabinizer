import React from "react";
import { GoogleLogin } from 'react-google-login';

const responseGoogle = (response) => {
  console.log(response);
}

const App: React.FC = () => {
  return <div><h1>Hello Cabinizer 3000</h1>
    <GoogleLogin
        clientId="611538057711-dia11nhabvku7cgd0edubeupju1jf4rg.apps.googleusercontent.com"
        hostedDomain="miles.no"
        buttonText="Login"
        autoLoad={true}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
    />
  </div>;
};

export default App;
