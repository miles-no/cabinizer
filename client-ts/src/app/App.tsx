import React, {useState} from "react";
import { GoogleLogin } from 'react-google-login';
import Menu from "./layout/Menu";


const loginFailed = (response) => {
  console.log(response);

}

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState( null);
  const loginSuccess = (response) => {
    console.log(response);
setAccessToken(response.access_token);
setProfile(response.profileObj);
  }

  return <div>
    <h1>Hello {profile? profile.name: "Cabinizer 3001"}</h1>
    {/* <Menu/> */}
    <GoogleLogin
        clientId="611538057711-dia11nhabvku7cgd0edubeupju1jf4rg.apps.googleusercontent.com"
        hostedDomain="miles.no"
        buttonText="Login"
        autoLoad={true}
        onSuccess={loginSuccess}
        onFailure={loginFailed}
        cookiePolicy={'single_host_origin'}
    />
  </div>;
};

export default App;
