import React from 'react';
import { render } from 'react-dom';
import App from './App';


const mainNode = document.createElement("div");
document.body.appendChild(mainNode);

render(<App hidden={true} />, mainNode);
