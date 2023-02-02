# WebGL Graphics engine

## To Run
run `python3 -m http.server` in the graphics directory
go to [http://localhost:8000//main.html](http://localhost:8000//main.html)


## Files
main.html - main test file, runs engine with example display in browser
matrix.js - Matrix class used for model location and transformation math
vector.js - Vector class used for model and movement math
lib.js - A collection of misc functions used throughout to simplify WebGL calls
normal_mesh.js - The mesh class, responsible for loading and describing objects
lit_materials.js - The material class, responsible for textures and lighting properties
scene.js - The node class, describes nodes that every actor is tied to
light.js - The light class, extends the node class
cam.js - the camera class, extends the node class
controls.js - describes camera controls, depends on cam.js
tex - texture directory, texture files go here
objs - objects directory, mesh files go here

## Credits
Portions of this code was borrowed from Dr. Grant Williams