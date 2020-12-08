import { connect } from 'react-redux';
import * as THREE from 'three';
import { OrbitControls } from '../three.libs/OrbitControls';
import { STLLoader } from '../three.libs/STLLoader';
import { GLTFLoader } from '../three.libs/GLTFLoader';
import { CSS2DRenderer, CSS2DObject } from '../three.libs/CSS2DRenderer';
import { DRACOLoader } from '../three.libs/DRACOLoader';

import stlFiles from '../../../stubs/stlfiles.json';
import ModelActions from './ModelActions';

export default class ModelViewer {
  constructor(onDocumentClick, onLoadModel) {
    console.log('Constructing model viewer...');
    this.container, this.focused, this.camera, this.gltfscene, this.colorMap, this.bwMap, this.rotationalObject, this.terrain, this.cameraTarget, this.scene, this.renderer, this.mesh, this.raycaster, this.effect, this.INTERSECTED, this.target, THREE.DirectionalLight, this.labelRenderer;
    this.clickable = [];
    this.hoverable = [];
    this.labels = [];
    this.controls;
    this.mouse = new THREE.Vector2();
    this.highlighted = false;
    this.clickable_color = 0xf02011;
    this.clickable_opacity = 0.8;
    this.emissiveDefault = 0x000000;
    this.emissiveHighlight = 0x04CC00;
    this.texLoader = new THREE.TextureLoader();
    this.bwMap = this.texLoader.load( "../assets/Terrain_B&W.jpg");
    this.oaMap = this.texLoader.load( "../assets/Terrain_AO.jpg");;
    this.alphaMap = this.texLoader.load( "../assets/Terrain_Alpha.jpg");;

    this.listDivLabels = [];

    /**
     * Body Div
     */
    this.body = document.getElementsByTagName("body")[0];

    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseClick = this.onDocumentMouseClick.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.mark = this.mark.bind(this);
    this.unmark = this.unmark.bind(this);
    this.getTarget = this.getTarget.bind(this);
    this.makeLabel = this.makeLabel.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.makeBig = this.makeBig.bind(this);
    this.makeSmall = this.makeSmall.bind(this);
    this.endedLoading = this.endedLoading.bind(this);
    this.progressLoading = this.progressLoading.bind(this);
    this.errorLoading = this.errorLoading.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.getItem = this.getItem.bind(this);
    this.onHoverLeaveSidebarMenu = this.onHoverLeaveSidebarMenu.bind(this);
    this.onHoverSidebarMenu = this.onHoverSidebarMenu.bind(this);

    this.onDocumentClick = onDocumentClick;
    this.onLoadModel = onLoadModel;

    this.loadingManager = new THREE.LoadingManager(this.endedLoading, this.progressLoading, this.errorLoading);
    this.loadingManager.onStart = this.startLoading;

    console.log('Constructed model viewer');
  }

  destroy() {
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('click', this.onDocumentMouseClick);
    document.removeEventListener('onHoverMenu', this.getItem);
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log("Mouse X,Y: (" + this.mouse.x + "," + this.mouse.y + ")");
  }

  onTouchStart(event) {
    this.mouse.x = +(event.changedTouches[0].pageX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
  }

  onTouchEnd(event) {
    this.clickable.forEach(function (element) {
      if (this.INTERSECTED && this.INTERSECTED.uuid == element.uuid) {
        this.target = element.target;
        this.onDocumentClick(element, event);
      }
    }.bind(this))
  }

  onMouseDoubleClick(event){
    this.hoverable.forEach(function (element) {
      if (this.INTERSECTED && this.INTERSECTED.uuid == element.uuid) {
        // var newLook = new THREE.Vector3(parseInt(this.INTERSECTED.position.x), parseInt(this.INTERSECTED.position.y), parseInt(this.INTERSECTED.position.z));
        //
        // this.controls.target.set(parseInt(this.INTERSECTED.position.x), parseInt(this.INTERSECTED.position.y), parseInt(this.INTERSECTED.position.z));

        // "target" sets the location of focus, where the control orbits around
        // and where it pans with respect to.
        this.controls.target = new THREE.Vector3(parseInt(this.INTERSECTED.position.x), parseInt(this.INTERSECTED.position.y), parseInt(this.INTERSECTED.position.z));
        this.rotationalObject = this.controls.target;
        // center is old, deprecated; use "target" instead
        this.controls.center = this.target;

        this.hoverable.forEach(function (element) {
              if (this.INTERSECTED && this.INTERSECTED.uuid == element.uuid) {
                this.focused = element.tag;

                switch(element.tag) {
                  case "<label>Free workers buildings</label>":
                    this.controls.minAzimuthAngle = -3 * Math.PI / 5;
                    this.controls.maxAzimuthAngle = Math.PI * 0.2;
                    break;
                  case "<label>Prison Command</label>":
                    this.controls.minAzimuthAngle = -2 * Math.PI / 5;
                    this.controls.maxAzimuthAngle = Math.PI * 0.2;
                    break;
                  case "<label>Family meeting room</label>":
                    this.controls.minAzimuthAngle = -2 * Math.PI / 5;
                    this.controls.maxAzimuthAngle = Math.PI * 0.2;
                    break;
                  case "<label>Prison dormitories</label>":
                    this.controls.minAzimuthAngle = -2 * Math.PI / 4;
                    this.controls.maxAzimuthAngle = Math.PI * 0.2;
                    break;
                  case "<label>Roll Call Terrace</label>":
                    this.controls.minAzimuthAngle = -2 * Math.PI / 4;
                    this.controls.maxAzimuthAngle = Math.PI * 0.2;
                    break;
                  case "<label>Infirmery</label>":
                    this.controls.minAzimuthAngle = -2 * Math.PI / 4;
                    this.controls.maxAzimuthAngle = Math.PI * 0.2;
                    break;
                  case "<label>Isolation cells</label>":
                    this.controls.minAzimuthAngle = -2 * Math.PI / 4;
                    this.controls.maxAzimuthAngle = Math.PI * 0.3;
                    break;
                  default:
                    console.log(element.tag);
                    this.controls.minAzimuthAngle = -2 * Math.PI / 3;
                    this.controls.maxAzimuthAngle = Math.PI * 0.5;
                    break;
                }



              }
            }.bind(this)
        )

        // Set to true to disable use of the keys
        this.controls.noKeys = false;
        // The four arrow keys
        this.controls.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

        // this.camera.position.set(parseInt(this.INTERSECTED.position.x), parseInt(this.INTERSECTED.position.y) + 40, 500)
        this.controls.update();
        this.cameraTarget = new THREE.Vector3(parseInt(this.INTERSECTED.position.x), parseInt(this.INTERSECTED.position.y), parseInt(this.INTERSECTED.position.z));
      }
    }.bind(this));
  }

  onDocumentMouseClick(event) {
    event.preventDefault()
    this.clickable.forEach(function (element) {
      if (this.INTERSECTED && this.INTERSECTED.uuid == element.uuid) {

        this.target = element.target;
        this.onDocumentClick(element, event);



      }
    }.bind(this)
    )
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  mark(object3D) {
    object3D.material.emissive.setHex(this.emissiveHighlight);
    object3D.material.opacity = 1.0;
    object3D.material.needsUpdate = true;
  }

  unmark(object3D) {
    object3D.material.emissive.setHex(this.emissiveDefault);
    object3D.material.opacity = this.clickable_opacity;
    object3D.material.needsUpdate = true;
  }

  getItem(event) {
    for (let i = 0; i < this.scene.children.length; i++) {
      let child = this.scene.children[i];
      if (child.name === event.detail.id) {
        // this.mark(child);
        return child;
      }
    }
  }

  onHoverSidebarMenu(event) {
    let itemTomark = this.getItem(event);

    let label = document.getElementById("tag_" + event.detail.id);
    label.className = label.className + ' hovered';

    if (itemTomark) {
      this.mark(itemTomark);
    }
  }

  onHoverLeaveSidebarMenu(event) {
    let itemTounmark = this.getItem(event);

    let label = document.getElementById("tag_" + event.detail.id);
    label.className = 'tag';

    if (itemTounmark) {
      this.unmark(itemTounmark);
    }
  }

  onClickLabel(target) {
    switch (target.page_type) {
      case null:
        //Pop up message alerting user
        // console.log("can't click");
        //alert("Unclickable label! Click another one.");
        swal({
          title: "Error!",
          text: "Please click a green label",
          icon: "error",
        });
        break
      case 'photo_360':
        window.location.hash = '/content/photo/index/' + target.id;
        break
      case 'two_photo':
        window.location.hash = '/content/two_photo/' + target.id;
        break
    }
  }

  makeBig(divTag) {
    var color = "green"

    this.hoverable.forEach(function(element) {
      if(element.tag == divTag.id){
        if(element.target.id == null){
          console.log ("targetid :" + element.target.id)
          color = "yellow"
        }
        else {
          return;
        }
      }
    })

    for(var i = 0; i < this.labels.length; i++){
      if(this.labels[i][0] == divTag) {
        // console.log("made it here")
        if(color == "yellow"){
          this.labels[i][1] = true; //let the list of tags know that this element is being hovered over
          divTag.setAttribute("style", "border: solid; border-width: 1px; -webkit-box-shadow: none; -moz-box-shadow: none; boxShadow: none; background-color: #948d00; width: auto; font-size: large; border-radius: 0px;");
        }
        else {
          this.labels[i][1] = true; //let the list of tags know that this element is being hovered over
          divTag.setAttribute("style", "border: solid; border-width: 1px; -webkit-box-shadow: none; -moz-box-shadow: none; boxShadow: none; background-color: #04CC00; width: auto; font-size: large; border-radius: 0px;");

          var map = this.bwMap;
          map.encoding = THREE.sRGBEncoding;
          map.flipY = false;
          this.terrain.material.map = map;

          // map = this.aoMap;
          // map.encoding = THREE.sRGBEncoding;
          // map.flipY = false;
          // this.terrain.material.aoMap = map;
          //
          // map = this.alphaMap;
          // map.encoding = THREE.sRGBEncoding;
          // map.flipY = false;
          // this.terrain.material.alphaMap = map;
        }
      }
    }
  }

  makeSmall(divTag) {
    for(var i = 0; i < this.labels.length; i++){
      if(this.labels[i][0] == divTag) {
        this.labels[i][1] = false; //this element is no longer hovered over
        divTag.style.backgroundColor = "white";
      }
    }

    this.terrain.material.map = this.colorMap;
    this.terrain.material.aoMap = null;
    this.terrain.material.alphaMap = null;
  }

  startLoading(url, itemsLoaded, itemsTotal) {
    console.log("Started Loading...");
    let progressBarContainer = document.createElement("div");
    progressBarContainer.id = "progressBarContainer";

    let progressBar = document.createElement("div");
    progressBar.id = "progressBar";

    let myBar = document.createElement("div");
    myBar.id = "myBar";

    let textBar = document.createElement("div");
    textBar.id = "textBar";
    textBar.innerText = "Loading";

    progressBar.appendChild(myBar);
    progressBarContainer.appendChild(progressBar);
    progressBarContainer.appendChild(textBar);

    this.body.appendChild(progressBarContainer);
  }

  progressLoading(url, itemsLoaded, itemsTotal) {
    let percentage = (itemsLoaded / itemsTotal) * 100;
    percentage = percentage.toFixed(0);

    let myProgressBar = document.getElementById("myBar");
    myProgressBar.style.width = percentage + '%';
  }

  endedLoading() {
    console.log("Ended Loading!!!");

    /**
     * Adding labels stored in listDivLabels in the end only
     */
    for (let i = 0; i < this.listDivLabels.length; i++) {
      this.scene.add(this.listDivLabels[i]);
    }

    /**
     * Removing progressBar from view
     */
    let progressBar = document.getElementById("progressBarContainer");
    this.body.removeChild(progressBar);

    if (this.onLoadModel) {
      this.onLoadModel();
    }

  }

  errorLoading(url) {
    console.error(url);
  }

  init() {
    console.log("Model Viewer initialising...");

    /**
     * document
     */
    let model = document.getElementById("model");

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.set(-150, 150, 500)
    this.cameraTarget = new THREE.Vector3(135, 15, 0)
    this.rotationalObject = new THREE.Vector3(135, 15, 0)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x292929)

    const near = 1000;
    const far = 5000;
    const color = 0x292929;
    this.scene.fog = new THREE.Fog(color, near, far);

    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('dblclick', this.onMouseDoubleClick, false);
    document.addEventListener('click', this.onDocumentMouseClick, false);
    document.addEventListener('touchstart', this.onTouchStart, false);
    document.addEventListener('touchend', this.onTouchEnd, false);
    this.raycaster = new THREE.Raycaster();

    // lights
    var light = new THREE.AmbientLight(0x333333, .5); // soft white light
    this.scene.add(light);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
    this.directionalLight.position.set(0, 0, 0.1);
    this.scene.add(this.directionalLight);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x666666);

    model.appendChild(this.renderer.domElement)

    //gui = new GUI();

    /**
     * Initializing Labels
     */
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = 0;
    this.labelRenderer.domElement.style.opacity = 0.9;
    this.labelRenderer.domElement.style.height = "100%";
    let labelRenderDoc = document.getElementById('model');
    labelRenderDoc.appendChild(this.labelRenderer.domElement);

    // controls
    // WHAT DOES THIS REFER TO?
    this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI * 0.5;
    this.controls.minDistance = 0;
    this.controls.maxDistance = 800;
    console.log("This is a test");
    this.controls.minAzimuthAngle = -2 * Math.PI/3;
    this.controls.maxAzimuthAngle = Math.PI * 0.5;
    // need anohter line to work in render
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.008;
    window.addEventListener('resize', this.onWindowResize, false);

    document.addEventListener('onHoverMenu', this.onHoverSidebarMenu);
    document.addEventListener('onHoverMenuLeave', this.onHoverLeaveSidebarMenu);

    console.log("Model Viewer initialised");
  }

  loadModels() {
    console.log("Loading models...");
    // STL loader
    let loader = new STLLoader(this.loadingManager);

    // GLB loader
    let gltfLoader = new GLTFLoader(this.loadingManager);

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/libs/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    stlFiles.clickable.forEach(function (element) {
      loader.load(element.file_name, function (geometry) {
        var material = new THREE.MeshLambertMaterial({ color: 0xFFC54B, flatShading: true, transparent: true })
        material.opacity = this.clickable_opacity

        material.polygonOffset = true
        material.polygonOffsetFactor = -2 // positive value pushes polygon further away
        material.polygonOffsetUnits = 1
        material.needsUpdate = true

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(element.x_pos, element.y_pos, element.z_pos)
        var newScale = (parseFloat(element.scale) + 0.005);
        this.mesh.scale.set(element.scale, element.scale, newScale)
        this.mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot), THREE.Math.degToRad(element.z_rot))

        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        // console.log("Clickable room: " + element.file_name + ", uuid: " + this.mesh.uuid ", target: " + target: element.target);
        var clickable_room = { file_name: element.file_name, uuid: this.mesh.uuid, target: element.target }
        this.clickable.push(clickable_room);
        this.mesh.name = element.target.id;
        this.scene.add(this.mesh);

        /**
         * new by sprites
         */
        let divLabel = this.makeLabel(element);
        if (divLabel) {
          this.listDivLabels.push(divLabel);
        }
      }.bind(this))
    }.bind(this))
    stlFiles.not_clickable.forEach(function (element) {
      loader.load(element.file_name, function (geometry) {
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, flatShading: true })
        material.opacity = 0.6

        material.polygonOffset = true
        material.polygonOffsetFactor = 1 // positive value pushes polygon further away
        material.polygonOffsetUnits = 1
        material.needsUpdate = true

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(element.x_pos, element.y_pos, element.z_pos)
        this.mesh.scale.set(element.scale, element.scale, element.scale)
        this.mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot), THREE.Math.degToRad(element.z_rot))

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.scene.add(this.mesh);
        /**
         * new by sprites
         */
        let divLabel = this.makeLabel(element);
        if (divLabel) {
          this.listDivLabels.push(divLabel);
        }
      }.bind(this))
    }.bind(this))
    stlFiles.orbs.forEach(function (element) {
      let geometry = new THREE.SphereGeometry(25, 25, 25)
      let material = new THREE.MeshLambertMaterial({ color: 0xFFC54B, transparent: true, flatShading: true });
      material.opacity = this.clickable_opacity

      material.polygonOffset = true;
      material.polygonOffsetFactor = -2; // positive value pushes polygon further away
      material.polygonOffsetUnits = 1;
      material.needsUpdate = true

      var sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(element.x_pos, element.y_pos, element.z_pos)
      sphere.scale.set(element.size, element.size, element.size)

      var clickable_orb = { uuid: sphere.uuid, target: element.target }
      this.clickable.push(clickable_orb)

      sphere.name = element.target.id;

      var hover_sphere = { uuid: sphere.uuid, tag: element.label, links: element.links.labels, target: element.target}
      this.hoverable.push(hover_sphere);

      this.scene.add(sphere);

      /**
         * new by sprites
         */

      // console.log(element);
      let divLabel = this.makeLabel(element);
      if (divLabel) {
        this.listDivLabels.push(divLabel);
      }
    }.bind(this))
    stlFiles.terrain.forEach(function (element) {
      gltfLoader.load(element.file_name, function (gltf) {

        gltf.scene.scale.set(element.scale, element.scale, element.scale);
        gltf.scene.position.set(element.x_pos, element.y_pos, element.z_pos);
        gltf.scene.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot), THREE.Math.degToRad(element.z_rot));

        // console.log(gltf.scene.children[1])
        // gltf.scene.children[1].material.color = new THREE.Color( 0x000000 );
        // gltf.scene.children[1].material.opacity = 0.3;
        //     console.log(gltf.scene.children[1])
        this.scene.add(gltf.scene);
        this.terrain = gltf.scene.children[1];
        this.gltfscene = gltf.scene;

        this.colorMap = this.terrain.material.map;

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene.posi; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      }.bind(this),
          (xhr) => {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
          },
          (error) => {
            console.log('an error occurred: ', error);
          });
    }.bind(this))

    stlFiles.hover.forEach(function (element) {
      loader.load(element.file_name, function (geometry) {
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true, transparent: true })
        material.opacity = this.clickable_opacity

        material.polygonOffset = true
        material.polygonOffsetFactor = -2 // positive value pushes polygon further away
        material.polygonOffsetUnits = 1
        material.needsUpdate = true

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(element.x_pos, element.y_pos, element.z_pos)
        var newScale = (parseFloat(element.scale) + 0.005);
        this.mesh.scale.set(element.scale, element.scale, newScale)
        this.mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot), THREE.Math.degToRad(element.z_rot))

        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        // console.log("Clickable room: " + element.file_name + ", uuid: " + this.mesh.uuid ", target: " + target: element.target);
        var hover_room = { file_name: element.file_name, uuid: this.mesh.uuid, tag: element.label, links: element.links.labels, target: element.target}
        this.hoverable.push(hover_room);

        this.mesh.name = element.target.id;
        this.scene.add(this.mesh);

        /**
         * new by sprites
         */
        let divLabel = this.makeLabel(element);
        if (divLabel) {
          this.listDivLabels.push(divLabel);
        }
      }.bind(this))
    }.bind(this))


    //add floor plane
    const geometry = new THREE.PlaneGeometry( 15000, 15000, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0x58606e, side: THREE.DoubleSide} );
    geometry.uuid = "floorPlane";
    const plane = new THREE.Mesh( geometry, material );
    // plane.id = "floorPlane";
    plane.rotation.x=THREE.Math.degToRad(-90);
    plane.position.y = -300;
    plane.position.z = 2500;
    this.scene.add( plane );

    console.log("Loaded models");
  }

  //Labels are created here.
  //passes in info on position, tag, size, where to go
  makeLabel(element) {
    if (!element.label) {
      return null;
    }

    // for circle
    let divLabel = document.createElement('div');
    divLabel.className = 'label';

    // for line
    let divLine = document.createElement("div");
    divLine.className = "line";
    
    let divTag = document.createElement("div");
    divTag.setAttribute("id", element.label);
    divTag.onmouseover = (event) => this.makeBig(divTag);
    divTag.onmouseout = (event) => this.makeSmall(divTag);
    console.log("target:" + element.target);
    divTag.className = "tag";
    divTag.innerHTML = element.label;

    if(element.target.id != null){
      divTag.onclick = (event) => this.onClickLabel(element.target);
    }
    //TODO
    else{
      divTag.onclick = (event) => this.onClickLabel(element.target);
    }

    divLabel.appendChild(divLine);
    divLabel.appendChild(divTag);
    var label = new CSS2DObject(divLabel);

    let pos_x = new Number(element.label_x ? element.label_x : element.x_pos);
    pos_x = pos_x;
    let pos_y = new Number(element.label_y ? element.label_y : element.y_pos);
    pos_y = pos_y;
    let pos_z = new Number(element.label_z ? element.label_z : element.z_pos);
    pos_z = pos_z;

    label.position.set(pos_x.toString(), pos_y.toString(), pos_z.toString());
    label.name = element.label;
    var newDiv = [];
    newDiv.push(divTag);
    newDiv.push(false);
    this.labels.push(newDiv);
    return label;
  }

  renderMod() {
    let chars = [...this.labels];
    let uniqueChars = [];
    let replacement = [];

    //identify the correct list from list with duplicates
    chars.forEach((c) => {
      if (!uniqueChars.includes(c[0].innerHTML)) {
        uniqueChars.push(c[0].innerHTML);
        replacement.push(c);
      }
    });

    //remove from doc extras
    this.labels.forEach((element) => {
      if(!replacement.includes(element)){
        element[0].remove();
      }
    });
    this.labels = replacement;


    this.camera.lookAt(this.cameraTarget);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children);

    // console.log("running")

    //This will give a list of every mesh the mouse is overlapping with.
    for (var i = 0; i < intersects.length; i++) {
      this.hoverable.forEach(function (element) {
        if (intersects[i].object.uuid === element.uuid) {
          // console.log("Hoverable UUID: " + element.uuid + ", Intersects UUID: " + intersects[i].object.uuid)
          this.highlighted = true;
          if (this.INTERSECTED != intersects[i].object) {
            if (this.INTERSECTED) {
              //Get this.INTERSECTED position and intersects[i].objects position
              //find which is closer to camera
              var cameraPos = this.camera.position;
              var oldHighlightPos = this.INTERSECTED.position;
              var newHighlightPos = intersects[i].object.position;
              return;
            }
            this.INTERSECTED = intersects[i].object
            this.mark(this.INTERSECTED)
          }
        } else if (!this.highlighted) {
          if (this.INTERSECTED) { this.unmark(this.INTERSECTED) }
          this.INTERSECTED = null
        }
      }.bind(this))
    }

    //runs when hovering over a building
      this.hoverable.forEach(function (element) {
        if(this.INTERSECTED != null) {
          if (this.INTERSECTED.uuid === element.uuid) {
            if (element.links.length > 0) {
              element.links.forEach((link) => {
                this.hoverable.forEach((hover) => {
                  //check if link and hover are same, if so, enlarge hover
                  if (hover.tag == link) {
                    this.maxLabel(hover);
                  }
                });
              });
            }
            this.maxLabel(element);
          }
        }
      }.bind(this))


    this.highlighted = false;
    if(intersects.length == 1 && intersects[0].object.geometry.uuid == "floorPlane") {
      if (this.INTERSECTED) { this.unmark(this.INTERSECTED) }
      this.INTERSECTED = null;
      this.minLabel();
    }
    if (intersects.length == 0) {
      if (this.INTERSECTED) { this.unmark(this.INTERSECTED) }
      this.INTERSECTED = null;
      this.minLabel();
    }

    this.directionalLight.position.copy(this.camera.position);
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  maxLabel(element){
    this.labels.forEach(function (currLabel) {
      var linkedTag = false;
      if(currLabel[1] == false) {
        if (currLabel[0].innerHTML == element.tag) {
          currLabel[0].setAttribute("style", "animation-name: labelGrow; animation-duration: 0.5s; width: auto; -webkit-box-shadow: none; -moz-box-shadow: none; boxShadow: none; background-color: #969532; font-size: 15px; border-radius: 0px;");
          linkedTag = true;
        }
        //is it a linked tag?
        if(element.links.length > 0){
          element.links.forEach((link) => {
            if(link == currLabel[0].innerHTML){
              linkedTag = true;
            }
          });
        }
        if(!linkedTag) {
          currLabel[0].setAttribute("style", "animation-name: labelShrink; animation-duration: 0.5s; -webkit-box-shadow: 0 0 20px #a8c418; -moz-box-shadow: 0 0 20px #a8c418; boxShadow: 0 0 20px #a8c418; background-color: black; width: 13px; font-size: 0px; border-radius: 20px;");
        }
      }
    });
  }

  calcDistance(posCam, pos1, pos2){
    var dist1 = Math.sqrt((Math.pow((posCam.x - pos1.x), 2)) + (Math.pow((posCam.y - pos1.y), 2)) + (Math.pow((posCam.z - pos1.z), 2)))
    var dist2 = Math.sqrt((Math.pow((posCam.x - pos2.x), 2)) + (Math.pow((posCam.y - pos2.y), 2)) + (Math.pow((posCam.z - pos2.z), 2)))
    if(dist1 < dist2){
      return pos1;
    }
    else{
      return pos2;
    }
  }

  minLabel(){
    this.labels.forEach(function (currLabel) {
      if(currLabel[1] == false) {
        currLabel[0].setAttribute("style", "animation-name: labelShrink; animation-duration: 0.5s; -webkit-box-shadow: 0 0 20px #a8c418; -moz-box-shadow: 0 0 20px #a8c418; boxShadow: 0 0 20px #a8c418; background-color: black; width: 13px; font-size: 0px; border-radius: 20px;");
      }
    });
  }

  getTarget() {
    console.log("get target " + this.target);
    return this.target;
  }
}