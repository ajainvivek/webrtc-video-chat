import { hot } from 'react-hot-loader';
import React from 'react';
import Video from './components/Video';
import './App.css';

const App = () => (
  <div className="App">
    <Video />
  </div>
);

export default hot(module)(App);
