import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import Header from "./components/hedaer/Header";
import Game from "./Game";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <Game />
  </React.StrictMode>
);
