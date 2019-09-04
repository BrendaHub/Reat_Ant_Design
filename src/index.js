import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Life from './pages/demo';
import Admin from './admin'
import Router from './router'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();