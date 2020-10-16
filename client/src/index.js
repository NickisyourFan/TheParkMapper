import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

require('dotenv').config()

ReactDOM.render(
  <Auth0Provider
    domain="the-park-mapper.us.auth0.com"
    clientId="adDKsfhti1Kf5odm4NBXoKTnuydJWm4U"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);