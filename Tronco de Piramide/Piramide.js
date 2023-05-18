    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);
    
    var size = 10;
    var arrowSize = 4;
    var divisions = 100;
    var origin = new THREE.Vector3( 0, 0, 0 );
    var x = new THREE.Vector3( 1, 0, 0 );
    var y = new THREE.Vector3( 0, 1, 0 );
    var z = new THREE.Vector3( 0, 0, 1 );
    var color2 = new THREE.Color( 0x333333 );
    var colorR = new THREE.Color( 0xAA0000 );
    var colorG = new THREE.Color( 0x00AA00 );
    var colorB = new THREE.Color( 0x0000AA );
    
    
    //Ejes Grilla y Camara
    var gridHelperXZ = new THREE.GridHelper( size, divisions, color2, color2);
    
    var arrowX = new THREE.ArrowHelper( x, origin, arrowSize, colorR );
    var arrowY = new THREE.ArrowHelper( y, origin, arrowSize, colorG );
    var arrowZ = new THREE.ArrowHelper( z, origin, arrowSize, colorB );
  
    var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
    camera.position.z = 4;
    camera.position.y = 4;
    camera.position.x = 4;
    const light = new THREE.AmbientLight(0x404040, 5);
    
    
    //elementos a la Escena
    scene.add(arrowX, arrowY, arrowZ, gridHelperXZ, camera, light);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);//orbitControls


   
    //Parametros oara la funcion  
    /*
     nlados  // # DE LADOS
     apo  // APOTEMA
     escl  //ESCALADO
     h  // ALTURA DE LA PIRAMIDE
    */


function troncoPiramide(nlados, apo, escl, h) {
  
  var vert_1 = []; // Verice_1
  var vert_2 = []; // Vertice_2
  var factor = 1 + (escl / 60);
  
  var angulo = (2 * Math.PI) / nlados;
  for (let i = 0; i < nlados; i++) {
    let x1 = apo * Math.cos(i * angulo);
    let z1 = apo * Math.sin(i * angulo);
    vert_1.push(x1, 0, z1);

    let x2 = apo * factor * Math.cos(i * angulo);
    let z2 = apo * factor * Math.sin(i * angulo);
    vert_2.push(x2, h, z2);
  }


  // # de vertices en vert_1 y Vert_2

var nVertices1 = vert_1.length / 3; 
var nVertices2 = vert_2.length / 3;

// Vertices para la geometria
var vertices = vert_1.concat(vert_2); 

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  // Calcular el número de vértices y caras
  var numero_Caras = Math.min(nVertices1, nVertices2) - 1;

  // crea Matriz lista para generar las caras 
  var lista = [];

// CARAS 
for (let m = 0; m < nVertices1 - 1; m++) {
  var Verticecurrent1 = m;
  var Verticecurrent2 = m + nVertices1;
  var nxtVx1 = (m + 1) % nVertices1;
  var nxtVx2 = (m + 1) % nVertices2;

  for (let n = 0; n < nlados; n++) {
    var Verticelateral1 = Verticecurrent1 + n * nVertices1;
    var Verticelateral2 = Verticecurrent2 + n * nVertices1;
    var Verticelateral_nxt1 = nxtVx1 + n * nVertices1;
    var Verticelateral_nxt2 = nxtVx2 + n * nVertices1;

   
    // triángulo_1 cara lateral
    lista.push(Verticelateral1);
    lista.push(Verticelateral2);
    lista.push(Verticelateral_nxt1);
   
   
    //  triángulo_2 cara lateral

    lista.push(Verticelateral2);
    lista.push(Verticelateral_nxt2);
    lista.push(Verticelateral_nxt1);
  }
}

// Se conecta el primer y ultimo vertice con la ultima cara

var Verticecurrent1 = nVertices1 - 1;
var Verticecurrent2 = nVertices1 + nVertices2 - 1;
var nxtVert1 = 0;
var nxtVert2 = nVertices1;

for (let n = 0; n < nlados; n++) {
  var Verticelateral1 = Verticecurrent1 + n * nVertices1;
  var Verticelateral2 = Verticecurrent2 + n * nVertices1;
  var Verticelateral_nxt1 = nxtVert1 + n * nVertices1;
  var Verticelateral_nxt2 = nxtVert2 + n * nVertices1;

  // Primer triángulo de la cara lateral
  lista.push(Verticelateral1);
  lista.push(Verticelateral2);
  lista.push(Verticelateral_nxt1);

  // Segundo triángulo de la cara lateral
  lista.push(Verticelateral2);
  lista.push(Verticelateral_nxt2);
  lista.push(Verticelateral_nxt1);
}

// Unir los vértices de la base con la tapa

for (let m = 0; m < nlados; m++) {
  var Verticebase_1 = m;
  var Verticebase_2 = (m + 1) % nlados;
  var Verticetapa_1 = Verticebase_1 + nVertices1;
  var Verticetapa_2 = Verticebase_2 + nVertices1;

  // Triángulo que une la base con la tapa
  lista.push(Verticebase_1);
  lista.push(Verticetapa_1);
  lista.push(Verticebase_2);

  lista.push(Verticebase_2);
  lista.push(Verticetapa_1);
  lista.push(Verticetapa_2);
}

//union de las Las caras y la base
  for (let m = 0; m < nlados; m++) {
    var Verticebase_1 = m;
    var Verticebase_2 = (m + 1) % nlados;
    var Verticebase_3 = nVertices1 - 1; // Último vértice de la base

    lista.push(Verticebase_1);
    lista.push(Verticebase_2);
    lista.push(Verticebase_3);
  }

//Union de las caras y la tapa

  for (let m = 0; m < nlados; m++) {
    var Verticetapa_1 = m + nVertices1;
    var Verticetapa_2 = (m + 1) % nlados + nVertices1;
    var Verticetapa_3 = nVertices2 - 1; // Último vértice de la tapa

    lista.push(Verticetapa_1);
    lista.push(Verticetapa_2);
    lista.push(Verticetapa_3);
  }
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  geometry.setIndex(lista);

  var material = new THREE.MeshBasicMaterial({ color: getRandomColor()});
  var mesh = new THREE.Mesh(geometry, material);

//Agregar a la escena
  scene.add(mesh);
}


//VALORES
var nlados = 5; // # DE LADOS
var apo = 1; // APOTEMA
var escl = -40 //ESCALADO
var h = 2; // ALTURA DE LA PIRAMIDE



//lamar la funcion
    
troncoPiramide(nlados,apo,escl,h); 

// RENDER

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();