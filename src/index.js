import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import './index.css';
import rootReducer from './app12/reducers'

import Dashboard from "./app5/pages/Dashboard";

const store = createStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <div className="App">
      <header/>
      <Dashboard />
    </div>
  </Provider>,
  document.getElementById('root')
);
