import React from 'react';
import { render } from 'react-dom';
import App from './app/App';

const renderApp = () => {
    render(<App />, document.getElementById("app-root"));
}

renderApp();