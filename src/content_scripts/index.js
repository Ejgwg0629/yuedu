import React from 'react';
import { render } from 'react-dom';
import App from './App.js';


const mainNode = document.createElement("div");
mainNode.id = "cr1315-yuedu-container";
document.body.appendChild(mainNode);

render(<App hidden={true} />, mainNode);

// render(
//   <App hidden={false} word="this"
//     translation={{
//       pronounces: [
//         {
//           style: "英",
//           pronounce: "[this]"
//         },
//         {
//           style: "美",
//           pronounce: "[this]"
//         }
//       ],
//       translations: [
//         {
//           PoS: "v.",
//           translation: "这个"
//         },
//         {
//           PoS: "n.",
//           translation: "这个解释比较长，可能能占两行， 但我们需要一个这样的测试用例，所以又一个这个。。"
//         },
//         {
//           PoS: "n.",
//           translation: "又一个这个。。"
//         }
//       ]
//     }}

//   />, 
//   mainNode
// );
