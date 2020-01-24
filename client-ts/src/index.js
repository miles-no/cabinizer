import React from "react";
import { render } from "react-dom";
import App from "./app/App";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const renderApp = () => {
  render(
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>,

    document.getElementById("app-root")
  );
};

renderApp();
