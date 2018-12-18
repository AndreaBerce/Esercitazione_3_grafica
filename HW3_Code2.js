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
    var centri = new Float32Array([0,0.8, 0,0.8, 0,-0.8, 0,-0.8]);
    var dimensioni = new Float32Array([0, 0.8, 0.8, 0]);
    var precisioneC = 128;
    var n = circleDrag(gl, centri, dimensioni, precisioneC);

    //var n = initVertexBuffersCube(gl);

    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set texture
    if (!initTextures(gl, 1)) {
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
    var cameraPos = [0,3,8];          // camera position
    //********************************************************************************************

    //********************************************************************************************
    // creo una GUI con dat.gui
    var gui = new dat.GUI();
    // checkbox geometry
    var geometria = {cylinder:true,sphere:false};
    gui.add(geometria,'cylinder').onFinishChange(function(value) {
       // Fires when a controller loses focus.
  	   if(value == true){
        		geometria.cylinder = value;
        		geometria.sphere = false;

            centri = new Float32Array([0,0.8, 0,0.8, 0,-0.8, 0,-0.8]);
            dimensioni = new Float32Array([0, 0.8, 0.8, 0]);
            precisioneC = 128;
            n = circleDrag(gl, centri, dimensioni, precisioneC);

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
        		geometria.cylinder = false;
        		geometria.sphere = value;

            precisioneC = 128;
            centri = new Float32Array(precisioneC*2);
            dimensioni = new Float32Array(precisioneC);

            var raggio = 1;
            var angolo = Math.PI / 2;
            for(var i = 0; i < precisioneC; i++){
               centri[i*2] = 0;                                // x
               centri[i*2+1] = raggio * Math.sin(angolo);      // y
               dimensioni[i] = raggio * Math.cos(angolo);
               angolo = angolo - ( Math.PI / (precisioneC - 1) );
            }
            dimensioni[0] = 0;
            dimensioni[precisioneC-1] = 0;

            n = initVertexBuffersSphere(gl, centri, dimensioni, precisioneC);

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

    var textures = {t1:true, t2:false, t3:false, t4:false, t5:false, t6:false};
    gui.add(textures, 't1').onFinishChange(function(value) {
       if( value == true ){
          textures.t1 = value;
          textures.t2 = false;
          textures.t3 = false;
          textures.t4 = false;
          textures.t5 = false;
          textures.t6 = false;

          // Set texture
          if (!initTextures(gl, 1)) {
              console.log('Failed to intialize the texture.');
              return;
          }
       }
       // Iterate over all controllers
       for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
       }
    });
    gui.add(textures, 't2').onFinishChange(function(value) {
       if( value == true ){
          textures.t1 = false;
          textures.t2 = value;
          textures.t3 = false;
          textures.t4 = false;
          textures.t5 = false;
          textures.t6 = false;

          // Set texture
          if (!initTextures(gl, 2)) {
              console.log('Failed to intialize the texture.');
              return;
          }
       }
       // Iterate over all controllers
       for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
       }
    });
    gui.add(textures, 't3').onFinishChange(function(value) {
       if( value == true ){
          textures.t1 = false;
          textures.t2 = false;
          textures.t3 = value;
          textures.t4 = false;
          textures.t5 = false;
          textures.t6 = false;

          // Set texture
          if (!initTextures(gl, 3)) {
              console.log('Failed to intialize the texture.');
              return;
          }
       }
       // Iterate over all controllers
       for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
       }
    });
    gui.add(textures, 't4').onFinishChange(function(value) {
       if( value == true ){
          textures.t1 = false;
          textures.t2 = false;
          textures.t3 = false;
          textures.t4 = value;
          textures.t5 = false;
          textures.t6 = false;

          // Set texture
          if (!initTextures(gl, 4)) {
              console.log('Failed to intialize the texture.');
              return;
          }
       }
       // Iterate over all controllers
       for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
       }
    });
    gui.add(textures, 't5').onFinishChange(function(value) {
       if( value == true ){
          textures.t1 = false;
          textures.t2 = false;
          textures.t3 = false;
          textures.t4 = false;
          textures.t5 = value;
          textures.t6 = false;

          // Set texture
          if (!initTextures(gl, 5)) {
              console.log('Failed to intialize the texture.');
              return;
          }
       }
       // Iterate over all controllers
       for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
       }
    });
    gui.add(textures, 't6').onFinishChange(function(value) {
       if( value == true ){
          textures.t1 = false;
          textures.t2 = false;
          textures.t3 = false;
          textures.t4 = false;
          textures.t5 = false;
          textures.t6 = value;

          // Set texture
          if (!initTextures(gl, 6)) {
              console.log('Failed to intialize the texture.');
              return;
          }
       }
       // Iterate over all controllers
       for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
       }
    });
    //*********************************************************************************************

    var currentAngle = 180.0;           // Current rotation angle
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
      	modelMatrix.setRotate(currentAngle, 0, -1, 0); // Rotate around the y-axis

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
  var uvs = new Float32Array( (vertices.length / 3) * 2 );

  // Controllo se è un solido chiuso
  if( centri[0] == centri[centri.length-2] && centri[1] == centri[centri.length-1] ){
      isClosed = true;
  }

  var angolo = 0;
  var count = 0;
  var ind = 0;
  var ind2 = 0;
  var x, y, z;
  var supporto = 1;
  var countIndTexture = 0;

  for( var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti

      if( distanza[i] > 0 ){  // Se deve essere un poligono
          if( distanza[i-1] == 0 ){ // se prima c'era un punto
              supporto = 0;
              angolo = Math.PI;
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count] = centri[(i-1) * 2];
                  vertices[count+1] = centri[(i-1) * 2 + 1];
                  vertices[count+2] = 0;

                  uvs[countIndTexture] = 0.5;
                  uvs[countIndTexture + 1] = 0.5;

                  // Calcolo delle coordinate dei punti sui cerchi minori
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  uvs[countIndTexture + 2] = 0.5 + -Math.cos(angolo) * 0.5;
                  uvs[countIndTexture + 3] = 0.5 + Math.sin(angolo) * 0.5;


                  angolo = angolo - ( Math.PI / precisioneC );
                  supporto = supporto - ( 2 / precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  uvs[countIndTexture + 4] = 0.5 + -Math.cos(angolo) * 0.5;
                  uvs[countIndTexture + 5] = 0.5 + Math.sin(angolo) * 0.5;

                  countIndTexture = countIndTexture + 6;


                  indices[ind] = ind2;        // 0
                  indices[ind+1] = ind2 + 1;  // 2
                  indices[ind+2] = ind2 + 2;  // 1

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }

          }else{ // se prima c'era un poligono
              supporto = 0;
              for( var j = 0; j < precisioneC; j++ ){
                  // 1
                  x = centri[(i-1) * 2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  // 5
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  // 6
                  angolo = angolo + ( Math.PI / precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;


                  indices[ind] = ind2;        // 5
                  indices[ind+1] = ind2 + 1;  // 6
                  indices[ind+2] = ind2 + 2;  // 1
                  uvs[countIndTexture] = supporto;  //5
                  uvs[countIndTexture + 1] = 0;
                  uvs[countIndTexture + 4] = supporto;  //1
                  uvs[countIndTexture + 5] = 1;
                  supporto = supporto + ( 1 / precisioneC );

                  // 2
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+9] = x;
                  vertices[count+10] = y;
                  vertices[count+11] = z;


                  indices[ind+3] = ind2 + 2;  // 1
                  indices[ind+4] = ind2 + 1;  // 6
                  indices[ind+5] = ind2 + 3;  // 2

                  uvs[countIndTexture + 2] = supporto;  //6
                  uvs[countIndTexture + 3] = 0;
                  uvs[countIndTexture + 6] = supporto;  //2
                  uvs[countIndTexture + 7] = 1;

                  countIndTexture = countIndTexture + 8;

                  ind = ind + 6;
                  ind2 = ind2 + 4;
                  count = count + 12;
              }
          }

      }else{  // Se il precedente era un poligono
          supporto = 1;
          angolo = Math.PI;
          var angolo2 = 0;
          if( i > 0 && distanza[i-1] != 0){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count+6] = centri[i*2];  // 9
                  vertices[count+7] = centri[i*2 + 1];
                  vertices[count+8] = 0;

                  uvs[countIndTexture + 4] = 0.5;
                  uvs[countIndTexture + 5] = 0.5;

                  // 5
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  uvs[countIndTexture + 2] = 0.5 + Math.cos(angolo2) * 0.5;
                  uvs[countIndTexture + 3] = 0.5 + Math.sin(angolo2) * 0.5;

                  // 6
                  angolo = angolo - ( Math.PI / precisioneC );
                  angolo2 = angolo2 - ( Math.PI / precisioneC );

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  uvs[countIndTexture] = 0.5 + Math.cos(angolo2) * 0.5;
                  uvs[countIndTexture + 1] = 0.5 + Math.sin(angolo2) * 0.5;

                  countIndTexture = countIndTexture + 6;

                  indices[ind] = ind2;        // 6
                  indices[ind+1] = ind2 + 1;  // 5
                  indices[ind+2] = ind2 + 2;  // 9

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
          }
      }
  }
  // console.log("vertices: ", vertices);
  // console.log("uvs: ", uvs);
  // console.log("indices: ", indices);


  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), gl.FLOAT, 3)) return -1;
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





function initVertexBuffersSphere(gl, centri, distanza, precisioneC) { // Create a sphere
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
  var uvs = new Float32Array( (vertices.length / 3) * 2 );

  var angolo = 0;
  var count = 0;
  var ind = 0;
  var ind2 = 0;
  var x, y, z;
  var supportox = 1;
  var supportoy = 1;
  var supportoYprecedente;
  var countIndTexture = 0;

  for( var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti
      supportox = 0;
      supportoYprecedente = supportoy;
      supportoy = supportoy - ( 1 / precisioneC );
      angolo = 0

      if( distanza[i] > 0 ){  // Se deve essere un poligono
          if( distanza[i-1] == 0 ){ // se prima c'era un punto
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count] = centri[(i-1) * 2];
                  vertices[count+1] = centri[(i-1) * 2 + 1];
                  vertices[count+2] = 0;


                  uvs[countIndTexture] = supportox - ( 1 / precisioneC ) / 2;
                  uvs[countIndTexture + 1] = supportoYprecedente;

                  // Calcolo delle coordinate dei punti sui cerchi minori
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  uvs[countIndTexture + 2] = supportox;
                  uvs[countIndTexture + 3] = supportoy;

                  angolo = angolo + ( Math.PI / precisioneC );
                  supportox = supportox + ( 1 / precisioneC );



                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  uvs[countIndTexture + 4] = supportox;
                  uvs[countIndTexture + 5] = supportoy;

                  countIndTexture = countIndTexture + 6;

                  indices[ind] = ind2;        // 0
                  indices[ind+1] = ind2 + 1;  // 2
                  indices[ind+2] = ind2 + 2;  // 1

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }

          }else{ // se prima c'era un poligono
              for( var j = 0; j < precisioneC; j++ ){
                  // 1
                  x = centri[(i-1) * 2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  // 5
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  // 6
                  angolo = angolo + ( Math.PI / precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  indices[ind] = ind2;        // 5
                  indices[ind+1] = ind2 + 1;  // 6
                  indices[ind+2] = ind2 + 2;  // 1

                  uvs[countIndTexture] = supportox;  //5
                  uvs[countIndTexture + 1] = supportoy;
                  uvs[countIndTexture + 4] = supportox;  //1
                  uvs[countIndTexture + 5] = supportoYprecedente;

                  supportox = supportox + ( 1 / precisioneC );


                  // 2
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+9] = x;
                  vertices[count+10] = y;
                  vertices[count+11] = z;

                  indices[ind+3] = ind2 + 2;  // 1
                  indices[ind+4] = ind2 + 1;  // 6
                  indices[ind+5] = ind2 + 3;  // 2

                  uvs[countIndTexture + 2] = supportox;  //6
                  uvs[countIndTexture + 3] = supportoy;
                  uvs[countIndTexture + 6] = supportox;  //2
                  uvs[countIndTexture + 7] = supportoYprecedente;

                  countIndTexture = countIndTexture + 8;

                  ind = ind + 6;
                  ind2 = ind2 + 4;
                  count = count + 12;
              }
          }

      }else{  // Se il precedente era un poligono
          if( i > 0 && distanza[i-1] != 0){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count+6] = centri[i*2];  // 9
                  vertices[count+7] = centri[i*2 + 1];
                  vertices[count+8] = 0;

                  uvs[countIndTexture + 4] = supportox - ( 1 / precisioneC ) / 2;
                  uvs[countIndTexture + 5] = supportoy;

                  // 5
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  uvs[countIndTexture + 2] = supportox;
                  uvs[countIndTexture + 3] = supportoYprecedente;

                  supportox = supportox + ( 1 / precisioneC );

                  // 6
                  angolo = angolo + ( Math.PI / precisioneC );

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  uvs[countIndTexture] = supportox;
                  uvs[countIndTexture + 1] = supportoYprecedente;

                  countIndTexture = countIndTexture + 6;

                  indices[ind] = ind2;        // 6
                  indices[ind+1] = ind2 + 1;  // 5
                  indices[ind+2] = ind2 + 2;  // 9

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
          }
      }
  }
  // console.log("vertices: ", vertices);
  // console.log("uvs: ", uvs);
  // console.log("indices: ", indices);


  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), gl.FLOAT, 3)) return -1;
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


function initTextures(gl, valore) {
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
    switch (valore) {
      case 1:   image.src = './textures/ash_uvgrid01.jpg';
                break;
      case 2:   image.src = './textures/03a.jpg';
                break;
      case 3:   image.src = './textures/floor-wood.jpg';
                break;
      case 4:   image.src = './textures/stone.jpg';
                break;
      case 5:   image.src = './textures/wall.jpg';
                break;
      case 6:   image.src = './textures/blueflower.jpg';
                break;
      default:  image.src = './textures/ash_uvgrid01.jpg';
    }

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
