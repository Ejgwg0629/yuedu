import React from 'react';
import { render } from 'react-dom';
import App from './App';



const node = document.createElement("div");
document.body.appendChild(node);
render(<App />, node);
