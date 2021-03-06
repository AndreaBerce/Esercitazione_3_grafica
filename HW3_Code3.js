// HW3_Code1.js
// implementazione texture mapping
// GDD - 2017
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n'   +
  'attribute vec4 a_Normal;\n'     +
  'uniform mat4 u_MvpMatrix;\n'    +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'uniform vec3 u_LightColor;\n'   +   // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'attribute vec2 a_TexCoord;\n'   +
  'varying vec2 v_TexCoord;\n'     +
  'varying vec4 v_color;\n'     +
  'void main() {\n'                +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +

  // Calculate a normal to be fit with a model matrix, and make it 1.0 in length
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  // Calculate world coordinate of vertex
  '  vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +
  // Calculate the light direction and make it 1.0 in length
  '  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
  // The dot product of the light direction and the normal
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  // Calculate the color due to diffuse reflection
  '  vec3 diffuse = u_LightColor * nDotL;\n' +
  '  v_color = vec4(diffuse, 1.0);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec4 v_color;\n'     +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
   '  gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_color;\n' +
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
    var raggio = 1.0000001*Math.sqrt(2);
    var centri = new Float32Array([0,1, 0,1, 0,-1, 0,-1]);
    var dimensioni = new Float32Array([0, raggio, raggio, 0]);
    var precisioneC = 4;
    var n = circleDrag(gl, centri, dimensioni, precisioneC);

    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set texture
    if (!initTextures(gl,1)) {
        console.log('Failed to intialize the texture.');
        return;
    }

    // Set the clear color and enable the depth test
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables and so on
    var u_ModelMatrix   = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_MvpMatrix     = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormalMatrix  = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_LightColor    = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');

    //  var u_CameraPos     = gl.getUniformLocation(gl.program, 'u_CameraPos');
    if (!u_MvpMatrix  ||  !u_NormalMatrix  ||  !u_LightColor  || !u_LightPosition  ||  !u_ModelMatrix) {
        console.log('Failed to get the storage location');
        return;
    }
    // *******************************************************************************************
    // Set the Specular and Diffuse light color
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, 1.0, 2.0, 12.0);

    var cameraPos = [0,3,8];          // camera position
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

            raggio = 1.0000001*Math.sqrt(2);
            centri = new Float32Array([0,1, 0,1, 0,-1, 0,-1]);
            dimensioni = new Float32Array([0, raggio, raggio, 0]);
            precisioneC = 4;
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
    gui.add(geometria,'cone').onFinishChange(function(value) {
       // Fires when a controller loses focus.
  	   if(value == true){
        		geometria.cube = false;
        		geometria.cone = value;
        		geometria.cylinder = false;
        		geometria.sphere = false;
        		geometria.torus = false;

            centri = new Float32Array([0,1.2, 0,-0.9, 0,-0.9]);
            dimensioni = new Float32Array([0, 0.7, 0]);
            precisioneC = 200;//128;
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
    gui.add(geometria,'cylinder').onFinishChange(function(value) {
       // Fires when a controller loses focus.
  	   if(value == true){
        		geometria.cube = false;
        		geometria.cone = false;
        		geometria.cylinder = value;
        		geometria.sphere = false;
        		geometria.torus = false;

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
        		geometria.cube = false;
        		geometria.cone = false;
        		geometria.cylinder = false;
        		geometria.sphere = value;
        		geometria.torus = false;

            precisioneC = 128;
            centri = new Float32Array(precisioneC*2);
            dimensioni = new Float32Array(precisioneC);

            raggio = 1;
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
    gui.add(geometria,'torus').onFinishChange(function(value) {
       // Fires when a controller loses focus.
  	   if(value == true){
        		geometria.cube = false;
        		geometria.cone = false;
        		geometria.cylinder = false;
        		geometria.sphere = false;
        		geometria.torus = value;

            centri = [];
            dimensioni = [];
            precisioneC = 125;

            // Genero i punti del cerchio principale
            raggione = 1;
            var raggino = 0.7;

            for(var i = 0; i <= 2*Math.PI; i+= 2*Math.PI/precisioneC){
               centri.push(raggione * Math.cos(i));                                // x
               centri.push(raggione * Math.sin(i));                                // y
               dimensioni.push(raggino);                                           // Raggio dei cerchi
            }

            //Il primo elemento si ripete
            centri.unshift(centri[1]);
            centri.unshift(centri[1]); //Pusho di nuovo lo stesso perché ora sono shiftati dopo il primo unshift
            dimensioni.unshift(0);
            //Ripeto anche l'ultimo, che sarà uguale al primo essendo una figura chiusa.
            centri.push(centri[0]);
            centri.push(centri[1]);
            dimensioni.push(raggino);

            n = circleDrag(gl, new Float32Array(centri), new Float32Array(dimensioni), precisioneC);


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
    //
    //----------------------------------------------------/
    var textures = {t1:true, t2:false, t3:false, t4:false, t5:false, t6:false};
    //
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
      	modelMatrix.setRotate(currentAngle, 1, -1, 0); // Rotate around the y-axis

      	mvpMatrix.set(vpMatrix).multiply(modelMatrix);
      	// Pass the model view projection matrix to u_MvpMatrix
      	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);



        // Pass the model matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        // Calculate the matrix to transform the normal based on the model matrix
      	normalMatrix.setInverseOf(modelMatrix);
      	normalMatrix.transpose();
      	// Pass the transformation matrix for normals to u_NormalMatrix
      	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);



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
  if( precisioneC == 4 ){
      angolo = Math.PI / 4;
  }
  var alphaPrecedente = 0;
  var count = 0;
  var ind = 0;
  var ind2 = 0;
  var x, y, z;
  var supporto = 1;
  var supporto2 = 0;
  var countIndTexture = 0;

  for( var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti
      // Trovo l'angolo corrente sul cerchio principale
      if(i == 0 || (i-2) == precisioneC){
          alphaCorrente = 0;
      }else{
          alphaCorrente = (i-1) * 2 * Math.PI / precisioneC;
      }

      if( distanza[i] > 0 ){  // Se deve essere un poligono
          if( distanza[i-1] == 0 ){ // se prima c'era un punto
              supporto = 1;
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count] = centri[(i-1) * 2];
                  vertices[count+1] = centri[(i-1) * 2 + 1];
                  vertices[count+2] = 0;

                  if( centri[(i-1) * 2 + 1] == centri[i * 2 + 1] && i > 0 ){  // nel caso del cubo e cilindro
                      uvs[countIndTexture] = 0.5;
                      uvs[countIndTexture + 1] = 0.5;
                  }else{  // nel caso del cono
                      uvs[countIndTexture] = supporto - ( 1 / precisioneC ) / 2;
                      uvs[countIndTexture + 1] = 1;
                  }

                  // Calcolo delle coordinate dei punti sui cerchi minori
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                      y = centri[i*2 + 1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  if( centri[(i-1) * 2 + 1] == centri[i * 2 + 1] && i > 0 ){
                      if( precisioneC == 4 ){ // nel caso del cubo
                          uvs[countIndTexture + 2] = 0.5 + -Math.cos(angolo) * Math.sqrt(0.5);
                          uvs[countIndTexture + 3] = 0.5 + Math.sin(angolo) * Math.sqrt(0.5);
                      }else{  // nel caso del cilindro
                          uvs[countIndTexture + 2] = 0.5 + -Math.cos(angolo) * 0.5;
                          uvs[countIndTexture + 3] = 0.5 + Math.sin(angolo) * 0.5;
                      }
                  }else{  // nel caso del cono
                      uvs[countIndTexture + 2] = supporto;
                      uvs[countIndTexture + 3] = 0;
                  }


                  angolo = angolo + ( 2 * Math.PI / precisioneC );
                  supporto = supporto - ( 1 / precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                      y = centri[i*2 + 1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  if( centri[(i-1) * 2 + 1] == centri[i * 2 + 1] && i > 0 ){
                      if( precisioneC == 4 ){ // nel caso del cubo
                          uvs[countIndTexture + 4] = 0.5 + -Math.cos(angolo) * Math.sqrt(0.5);
                          uvs[countIndTexture + 5] = 0.5 + Math.sin(angolo) * Math.sqrt(0.5);
                      }else{  // nel caso del cilindro
                          uvs[countIndTexture + 4] = 0.5 + -Math.cos(angolo) * 0.5;
                          uvs[countIndTexture + 5] = 0.5 + Math.sin(angolo) * 0.5;
                      }
                  }else{  // nel caos del cono
                      uvs[countIndTexture + 4] = supporto;
                      uvs[countIndTexture + 5] = 0;
                  }
                  countIndTexture = countIndTexture + 6;


                  if( isClosed ){
                      indices[ind] = ind2 + 2;
                      indices[ind+1] = ind2 + 1;
                      indices[ind+2] = ind2;
                  }else{
                      indices[ind] = ind2;        // 0
                      indices[ind+1] = ind2 + 1;  // 2
                      indices[ind+2] = ind2 + 2;  // 1
                  }

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
              alphaPrecedente = alphaCorrente;

          }else{ // se prima c'era un poligono
              if( isClosed ){
                  supporto = 0;
              }else{
                  supporto = 1;
              }
              var supporto2precedente = supporto2;
              supporto2 = supporto2 + ( 1 / precisioneC );
              for( var j = 0; j < precisioneC; j++ ){
                  // 1
                  x = centri[(i-1) * 2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1) * 2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                      y = centri[(i-1) * 2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  // 5
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                      y = centri[i*2 + 1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  // 6
                  angolo = angolo + ( 2 * Math.PI / precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  y = centri[i*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                      y = centri[i*2 + 1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;


                  if( isClosed ){
                      indices[ind] = ind2 + 2;    // 1
                      indices[ind+1] = ind2 + 1;  // 6
                      indices[ind+2] = ind2;      // 5
                      uvs[countIndTexture] = supporto2;       // 5
                      uvs[countIndTexture + 1] = supporto;
                      uvs[countIndTexture + 4] = supporto2precedente; // 1
                      uvs[countIndTexture + 5] = supporto;
                      supporto = supporto + ( 1 / precisioneC );
                  }else{
                      indices[ind] = ind2;        // 5
                      indices[ind+1] = ind2 + 1;  // 6
                      indices[ind+2] = ind2 + 2;  // 1
                      if( precisioneC == 4 ){
                          uvs[countIndTexture] = 1;
                          uvs[countIndTexture + 1] = 0;
                          uvs[countIndTexture + 2] = 0;
                          uvs[countIndTexture + 3] = 0;
                          uvs[countIndTexture + 4] = 1;
                          uvs[countIndTexture + 5] = 1;
                      }else{
                          uvs[countIndTexture] = supporto;  //5
                          uvs[countIndTexture + 1] = 0;
                          uvs[countIndTexture + 4] = supporto;  //1
                          uvs[countIndTexture + 5] = 1;
                      }
                      supporto = supporto - ( 1 / precisioneC );
                  }

                  // 2
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                      y = centri[(i-1)*2 + 1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+9] = x;
                  vertices[count+10] = y;
                  vertices[count+11] = z;

                  if( isClosed ){
                      indices[ind+3] = ind2 + 3;  // 2
                      indices[ind+4] = ind2 + 1;  // 6
                      indices[ind+5] = ind2 + 2;  // 1
                      uvs[countIndTexture + 2] = supporto2;         // 6
                      uvs[countIndTexture + 3] = supporto;
                      uvs[countIndTexture + 6] = supporto2precedente; // 2
                      uvs[countIndTexture + 7] = supporto;
                  }else{
                      indices[ind+3] = ind2 + 2;  // 1
                      indices[ind+4] = ind2 + 1;  // 6
                      indices[ind+5] = ind2 + 3;  // 2
                      if( precisioneC == 4 ){
                          uvs[countIndTexture + 6] = 0;
                          uvs[countIndTexture + 7] = 1;
                      }else{
                          uvs[countIndTexture + 2] = supporto;  //6
                          uvs[countIndTexture + 3] = 0;
                          uvs[countIndTexture + 6] = supporto;  //2
                          uvs[countIndTexture + 7] = 1;
                      }
                  }
                  countIndTexture = countIndTexture + 8;

                  ind = ind + 6;
                  ind2 = ind2 + 4;
                  count = count + 12;
              }
              alphaPrecedente = alphaCorrente;
          }

      }else{  // Se il precedente era un poligono
          if( i > 0 && distanza[i-1] != 0){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count+6] = centri[i*2];  // 9
                  vertices[count+7] = centri[i*2 + 1];
                  vertices[count+8] = 0;

                  if( isClosed ){
                      uvs[countIndTexture + 4] = supporto2;
                      uvs[countIndTexture + 5] = supporto;
                  }else{
                      uvs[countIndTexture + 4] = 0.5;
                      uvs[countIndTexture + 5] = 0.5;
                  }

                  // 5
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                      y = centri[(i-1)*2 + 1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  if( isClosed ){
                      uvs[countIndTexture + 2] = supporto2;
                      uvs[countIndTexture + 3] = supporto;
                  }else{
                      if( precisioneC == 4 ){
                          uvs[countIndTexture + 2] = 0.5 + Math.cos(angolo) * Math.sqrt(0.5);
                          uvs[countIndTexture + 3] = 0.5 + Math.sin(angolo) * Math.sqrt(0.5);
                      }else{
                          uvs[countIndTexture + 2] = 0.5 + Math.cos(angolo) * 0.5;
                          uvs[countIndTexture + 3] = 0.5 + Math.sin(angolo) * 0.5;
                      }
                  }

                  // 6
                  angolo = angolo + ( 2 * Math.PI / precisioneC );

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                      y = centri[(i-1)*2 + 1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  if( isClosed ){
                      uvs[countIndTexture] = supporto2;
                      uvs[countIndTexture + 1] = supporto;
                  }else{
                      if( precisioneC == 4 ){
                          uvs[countIndTexture] = 0.5 + Math.cos(angolo) * Math.sqrt(0.5);
                          uvs[countIndTexture + 1] = 0.5 + Math.sin(angolo) * Math.sqrt(0.5);
                      }else{
                          uvs[countIndTexture] = 0.5 + Math.cos(angolo) * 0.5;
                          uvs[countIndTexture + 1] = 0.5 + Math.sin(angolo) * 0.5;
                      }
                  }

                  countIndTexture = countIndTexture + 6;

                  indices[ind] = ind2;        // 6
                  indices[ind+1] = ind2 + 1;  // 5
                  indices[ind+2] = ind2 + 2;  // 9

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
              alphaPrecedente = alphaCorrente;
          }
      }
  }
  // console.log("vertices: ", vertices);
  // console.log("uvs: ", uvs);
  // console.log("indices: ", indices);


  var normals = new Float32Array(vertices.length);
  var temp = new Float32Array(10);
  count = 0;
  for( var  i = 0; i < (indices.length / 3) ; i++){

      temp[0] = vertices[indices[i*3]*3] - vertices[indices[i*3+1]*3];
      temp[1] = vertices[indices[i*3]*3 + 1] - vertices[indices[i*3+1]*3 + 1];
      temp[2] = vertices[indices[i*3]*3 + 2] - vertices[indices[i*3+1]*3 + 2];

      temp[3] = vertices[indices[i*3+2]*3] - vertices[indices[i*3+1]*3];
      temp[4] = vertices[indices[i*3+2]*3 + 1] - vertices[indices[i*3+1]*3 + 1];
      temp[5] = vertices[indices[i*3+2]*3 + 2] - vertices[indices[i*3+1]*3 + 2];

      temp[6] = (temp[1] * temp[5]) - (temp[2] * temp[4]);
      temp[7] = (temp[2] * temp[3]) - (temp[0] * temp[5]);
      temp[8] = (temp[0] * temp[4]) - (temp[1] * temp[3]);
      if(temp[6] == 0){temp[6] = 0;}
      if(temp[7] == 0){temp[7] = 0;}
      if(temp[8] == 0){temp[8] = 0;}

      temp[9] = Math.sqrt( temp[6]*temp[6] + temp[7]*temp[7] + temp[8]*temp[8] );

      for( var j = 0; j < 3; j++){
          normals[indices[i*3+j]*3] = temp[6] / temp[9];
          normals[indices[i*3+j]*3+1] = temp[7] / temp[9];
          normals[indices[i*3+j]*3+2] = temp[8] / temp[9];
      }
  }


  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', new Float32Array(uvs)      , gl.FLOAT, 2)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal'  , new Float32Array(normals)  , gl.FLOAT, 3)) return -1;

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
      supportox = 1;
      supportoYprecedente = supportoy;
      supportoy = supportoy - ( 1 / precisioneC );

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

                  angolo = angolo + ( 2 * Math.PI / precisioneC );
                  supportox = supportox - ( 1 / precisioneC );



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
                  angolo = angolo + ( 2 * Math.PI / precisioneC );

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

                  supportox = supportox - ( 1 / precisioneC );


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

                  supportox = supportox - ( 1 / precisioneC );

                  // 6
                  angolo = angolo + ( 2 * Math.PI / precisioneC );

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


  var normals = new Float32Array(vertices.length);
  var temp = new Float32Array(10);
  count = 0;
  for( var  i = 0; i < (indices.length / 3) ; i++){

      temp[0] = vertices[indices[i*3]*3] - vertices[indices[i*3+1]*3];
      temp[1] = vertices[indices[i*3]*3 + 1] - vertices[indices[i*3+1]*3 + 1];
      temp[2] = vertices[indices[i*3]*3 + 2] - vertices[indices[i*3+1]*3 + 2];

      temp[3] = vertices[indices[i*3+2]*3] - vertices[indices[i*3+1]*3];
      temp[4] = vertices[indices[i*3+2]*3 + 1] - vertices[indices[i*3+1]*3 + 1];
      temp[5] = vertices[indices[i*3+2]*3 + 2] - vertices[indices[i*3+1]*3 + 2];

      temp[6] = (temp[1] * temp[5]) - (temp[2] * temp[4]);
      temp[7] = (temp[2] * temp[3]) - (temp[0] * temp[5]);
      temp[8] = (temp[0] * temp[4]) - (temp[1] * temp[3]);
      if(temp[6] == 0){temp[6] = 0;}
      if(temp[7] == 0){temp[7] = 0;}
      if(temp[8] == 0){temp[8] = 0;}

      temp[9] = Math.sqrt( temp[6]*temp[6] + temp[7]*temp[7] + temp[8]*temp[8] );

      for( var j = 0; j < 3; j++){
          normals[indices[i*3+j]*3] = temp[6] / temp[9];
          normals[indices[i*3+j]*3+1] = temp[7] / temp[9];
          normals[indices[i*3+j]*3+2] = temp[8] / temp[9];
      }
  }



  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', new Float32Array(uvs)      , gl.FLOAT, 2)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal'  , new Float32Array(normals)  , gl.FLOAT, 3)) return -1;

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
