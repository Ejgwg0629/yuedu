import React from 'react';
import { render } from 'react-dom';
import App from './App.js';


const mainNode = document.createElement("div");
mainNode.id = "cr1315-yuedu-container";
document.body.appendChild(mainNode);

render(<App hidden={true} />, mainNode);
