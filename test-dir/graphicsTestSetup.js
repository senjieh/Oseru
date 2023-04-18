/**
 * @jest-environment jsdom
 */

// this is run as part of Jest before all tests
// needed for graphics tests
/*const jsdom = require('jsdom');

function createDocument() {
  const document = jsdom(undefined);
  const window = document.defaultView;
  global.document = document;
  global.window = window;

  Object.keys(window).forEach((key) => {
    if (!(key in global)) {
      global[key] = window[key];
    }
  });

  return document;
}

beforeAll(() => {
	let document = createDocument();

	document.body.innerHTML = 
    '    <canvas id = "the-canvas" width = "800" height = "600"></canvas>' +
    '    <script src = "lib.js"></script>' +
    '    <script src = "vector.js"></script>' +
    '    <script src = "matrix.js"></script>' +
    '    <script src = "normal_mesh.js"></script>' +
    '    <script src = "controls.js"></script> '+
    '    <script src = "lit_material.js"></script>' +
    '    <script src = "light.js"></script>' +
    '    <script src = "scene.js"></script>' +
    '    <script src = "node_note.js"></script>' +
    '    <script src = "menu.js"></script>';

});*/