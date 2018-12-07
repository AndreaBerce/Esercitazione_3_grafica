// HW3_Code1.js
// implementazione texture mapping
// GDD - 2017
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n'   +
  'uniform mat4 u_MvpMatrix;\n'    +
  'attribute vec2 a_TexCoord;\n'   +
  'varying vec2 v_TexCoord;\n'     +
  'void main() {\n'                +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
   '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

 // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex coordinates, the color and the normal
  var n = initVertexBuffersCube(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

   // Set texture
  if (!initTextures(gl)) {
    console.log('Failed to intialize the texture.');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix     = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

//  var u_CameraPos     = gl.getUniformLocation(gl.program, 'u_CameraPos');
  if (!u_MvpMatrix ) {
    console.log('Failed to get the storage location');
    return;
  }
  // *******************************************************************************************
  var cameraPos = [1,3,8];          // camera position
  //********************************************************************************************

  //********************************************************************************************
// creo una GUI con dat.gui
  var gui = new dat.GUI();
  // checkbox geometry
  var geometria = {cube:true,cone:false,cylinder:false,sphere:false,torus:false};
  //
  gui.add(geometria,'cube').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = value;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = false;
    		console.log(geometria.cube + " " +geometria.cone);
    		// Set the vertex coordinates, the color and the normal
    		n = initVertexBuffersCube(gl);
    		if (n < 0) {
    			console.log('Failed to set the vertex information');
    			return;
		    }
	   }
	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(geometria,'cone').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = value;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = false;
        n = initVertexBuffersCone(gl);
    		if (n < 0) {
    			console.log('Failed to set the vertex information');
    			return;
    		}
     }
	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(geometria,'cylinder').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = false;
    		geometria.cylinder = value;
    		geometria.sphere = false;
    		geometria.torus = false;
        n = initVertexBuffersCylinder(gl);
    		if (n < 0) {
    			console.log('Failed to set the vertex information');
    			return;
    		}
	   }
	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(geometria,'sphere').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = value;
    		geometria.torus = false;
    		n = initVertexBuffersSphere(gl);
    		if (n < 0) {
    			console.log('Failed to set the vertex information');
    			return;
    		}
     }
	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(geometria,'torus').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = value;
        n = initVertexBuffersTorus(gl);
    		if (n < 0) {
    			console.log('Failed to set the vertex information');
    			return;
    		}
	   }
	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  //*********************************************************************************************

  var currentAngle = 0.0;           // Current rotation angle
  var vpMatrix = new Matrix4();   // View projection matrix

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  vpMatrix.lookAt(cameraPos[0],cameraPos[1],cameraPos[2], 0, 0, 0, 0, 1, 0);

  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4(); 　  // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals

  var tick = function() {
	currentAngle = animate(currentAngle);  // Update the rotation angle

	// Calculate the model matrix
	modelMatrix.setRotate(currentAngle, 0, 1, 0); // Rotate around the y-axis

	mvpMatrix.set(vpMatrix).multiply(modelMatrix);
	// Pass the model view projection matrix to u_MvpMatrix
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	// Clear color and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw the cube(Note that the 3rd argument is the gl.UNSIGNED_SHORT)
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

	requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
}

function initVertexBuffersCube(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates
  var positions = new Float32Array([
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);
  console.log(positions);

  // TexCoord
  var uvs = new Float32Array( (positions.length / 3) * 2 );
  for( var i = 0; i < uvs.length / 8; i++ ){
    uvs[i*8] = 1.0;
    uvs[i*8+1] = 1.0;
    uvs[i*8+2] = 0.0;
    uvs[i*8+3] = 1.0;
    uvs[i*8+4] = 0.0;
    uvs[i*8+5] = 0.0;
    uvs[i*8+6] = 1.0;
    uvs[i*8+7] = 0.0;
    console.log(uvs);
  }
/*
  // TexCoord
  var uvs = new Float32Array([
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v0-v1-v2-v3 front
    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,  // v0-v3-v4-v5 right
    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,  // v0-v5-v6-v1 up
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v1-v6-v7-v2 left
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,  // v7-v4-v3-v2 down
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0   // v4-v7-v6-v5 back
  ]);*/
  console.log(uvs);

  // Indices of the vertices
  var indices = new Uint16Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', new Float32Array(uvs)      , gl.FLOAT, 2)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}




function circleDrag(gl, centri, distanza, precisioneC){  //coordinate centri, distanza punti da centri, precisione cerchi
  var isClosed = false; // Variabile che dice se la figura è chiusa

  // calcolo numero di vertici della figura
  var nv = 0; // numero vertici
  var ni = 0; // numero indici

  for( var i = 0; i < (centri.length / 2); i++ ){
      if( distanza[i] > 0 ){
          if( distanza[i-1] == 0 ){ // se prima c'era un punto
              ni = ni + precisioneC * 3;  // ni = ni + nTriangoli * nVertitiTriangolo
              nv = nv + precisioneC * 3;
          }else{ // se prima c'era un poligolo
              ni = ni + precisioneC * 6;  // ni = ni + nTriangoli * 2 * nVertitiTriangolo
              nv = nv + precisioneC * 4;
          }
      }else{
          if( i > 0 && distanza[i-1] != 0 ){ // se prima c'era un poligono
              ni = ni + precisioneC * 3;  // ni = ni + nTriangoli * nVertitiTriangolo
              nv = nv + precisioneC * 3;
          }
      }
  }
  nv = nv * 3;

  // creazione del vettore dei vertici
  var vertices = new Float32Array(nv);

  // Indices of the vertices
  var indices = new Uint16Array(ni);

  // TexCoord
  var uvs = new Float32Array( (positions.length / 3) * 2 );

  // Controllo se è un solido chiuso
  if(centri[0] == centri[centri.length-2] && centri[1] == centri[centri.length-1]){
    isClosed = true;
  }

  var angolo = Math.PI/4;
  var alphaPrecedente = 0;
  var count = 0;
  var ind = 0;
  var ind2 = 0;
  var x;
  var y;
  var z;
  for(var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti
      //stfu gli altri <3

      // Trovo l'angolo corrente sul cerchio principale
      if(i == 0 || (i-2) == precisioneC){
          alphaCorrente = 0;
      }else{
          alphaCorrente = (i-1) * 2*Math.PI/precisioneC;
      }

      if(distanza[i] > 0){  // Se deve essere un poligono
          if( distanza[i-1] == 0 ){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count] = centri[(i-1) * 2];
                  vertices[count+1] = centri[(i-1) * 2 +1];
                  vertices[count+2] = 0;

                  // Calcolo delle coordinate dei punti sui cerchi minori
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;


                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  if( isClosed ){
                      indices[ind] = ind2+2;
                      indices[ind+1] = ind2+1;
                      indices[ind+2] = ind2;
                  }else{
                    indices[ind] = ind2;
                    indices[ind+1] = ind2+1;
                    indices[ind+2] = ind2+2;
                  }

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
              alphaPrecedente = alphaCorrente;

          }else{
              for( var j = 0; j < precisioneC; j++ ){
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;


                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;


                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;


                  if( isClosed ){
                      indices[ind] = ind2+2;
                      indices[ind+1] = ind2+1;
                      indices[ind+2] = ind2;
                  }else{
                    indices[ind] = ind2;
                    indices[ind+1] = ind2+1;
                    indices[ind+2] = ind2+2;
                  }


                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+9] = x;
                  vertices[count+10] = y;
                  vertices[count+11] = z;

                  if( isClosed ){
                      indices[ind+3] = ind2+3;
                      indices[ind+4] = ind2+1;
                      indices[ind+5] = ind2+2;
                  }else{
                    indices[ind+3] = ind2+2;
                    indices[ind+4] = ind2+1;
                    indices[ind+5] = ind2+3;
                  }

                  ind = ind + 6;
                  ind2 = ind2 + 4;
                  count = count + 12;
              }
              alphaPrecedente = alphaCorrente;
          }
      }else{  // Se il precedente era un poligono

          // Ogni due lati, un quadrato tra loro e i loro corrispondenti nell'ultimo poligono
          // Se ho per esempio due quadrati e devo fare gli indici dei triangolini in mezzo:
          /*
          Precisione : 5
          indici da mettere:
          9,8,4,    4,3,8,    8,7,3,    3,2,7,    7,6,2,    2,1,6,    6,9,1,    1,4,9

          1---------2                             6---------7
          |         |                             |         |
          |    0    |    la parte prima,          |    5    |    la parte seconda
          |         |                             |         |
          4---------3                             9---------8
          */

          if( i > 0 && distanza[i-1] != 0){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count+6] = centri[i*2];
                  vertices[count+7] = centri[i*2 + 1];
                  vertices[count+8] = 0;

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  indices[ind] = ind2;
                  indices[ind+1] = ind2+1;
                  indices[ind+2] = ind2+2;

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
              alphaPrecedente = alphaCorrente;
          }
      }
  }


  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', new Float32Array(uvs)      , gl.FLOAT, 2)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}





function initVertexBuffersSphere(gl) { // Create a sphere

  return indices.length;
}

function initVertexBuffersCylinder(gl) { // Create a cylinder
  return indices.length;
}

function initVertexBuffersCone(gl) { // Create a cone
  return indices.length;
}

function initVertexBuffersTorus(gl) { // Create a torus
  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}
// Rotation angle (degrees/second)
var ANGLE_STEP = 20.0;
// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

function initTextures(gl) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to create the Sampler object');
    return false;
  }
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(gl, texture, u_Sampler, image); };
  // Tell the browser to load an image
  image.src = './textures/ash_uvgrid01.jpg';

  return true;
}

function loadTexture(gl, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
}
