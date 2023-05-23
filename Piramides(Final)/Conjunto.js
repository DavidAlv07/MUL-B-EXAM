
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
    camera.position.z = 20;
    camera.position.y = 5;
    scene.add(camera);
    var light = new THREE.AmbientLight(0x404040, 5);
    scene.add(light);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);//orbit controsl
    
    //ejes
    var axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper)
   
    var piramides = [];  // Arreglo de las pirámide
    
    
    // los parámetros para crear las pirámides
    var r_Base = 2; // Radio de la base 
    var n_Piramides = 4; // cantidad de pirámides
    var lados = 6; // Lados de la base 
    var h = 3; // Altura 

  function creacion(lado, radio, altura) {
 
  // Crear la geometría de la base poligonal
  var baseGeometry = new THREE.CircleBufferGeometry(radio, lado);
  baseGeometry.rotateX(Math.PI / 2); // Rotar la base poligonal 90 grados en el eje X
  baseGeometry.rotateY(Math.PI / 2);

  
  var r_superior = radio * 0.5;// radio superior
  var r_Inferior = radio;// radio inferior

  //pirámide truncada
  var truncGeometry = new THREE.CylinderBufferGeometry(r_superior, r_Inferior, altura, lado, 1, true);
  truncGeometry.translate(0, altura / 2, 0);

   
   var truncMesh = new THREE.Mesh(truncGeometry, new THREE.MeshBasicMaterial({ color: getRandomColor() }));// Mesh de la pirámide truncada


var Mesh_base = new THREE.Mesh(baseGeometry, new THREE.MeshBasicMaterial({ color: getRandomColor() }));// Mesh de la base poligonal


var geometría_tapa = new THREE.CircleBufferGeometry(r_superior, lados);// Geometria de la taoa

// Rotar la tapa para que esté orientada correctamente
geometría_tapa.rotateX(-Math.PI / 2);
geometría_tapa.rotateY(-Math.PI / 2);

// Mover la geometría de la tapa de la pirámide hacia arriba
geometría_tapa.translate(0, altura, 0);



// Crear el Mesh de la tapa de la pirámide
  var tapaMesh = new THREE.Mesh(geometría_tapa, new THREE.MeshBasicMaterial({ color: getRandomColor() }));

  // Crear un grupo para contener la base, la pirámide truncada y la tapa
  var group = new THREE.Group();
  group.add(truncMesh);
  group.add(Mesh_base);
  group.add(tapaMesh);

  return group;
}
    // Crear las pirámides y agregarlas al arreglo
    for (var i = 0; i < n_Piramides; i++) {
      var piramide = creacion(lados, r_Base, h);
      piramide.position.set(i * 5, 0, 0); // Ubicar las pirámides en línea recta
      piramides.push(piramide);
      scene.add(piramide);
    }
    
    // Crear las pirámides y agregarlas al arreglo
    for (var i = 0; i < n_Piramides; i++) {
      var piramide = creacion(lados, r_Base, h);
      piramide.position.set(i * 5, 5, 0); // Ubicar las pirámides en línea recta
      piramides.push(piramide);
      scene.add(piramide);
    }

//funcion para generar los colores (chatgPt)

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
   