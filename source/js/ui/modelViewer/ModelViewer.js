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
    this.container, this.camera, this.cameraTarget, this.scene, this.renderer, this.mesh, this.raycaster, this.effect, this.INTERSECTED, this.target, THREE.DirectionalLight, this.labelRenderer;
    this.clickable = [];
    this.mouse = new THREE.Vector2();
    this.highlighted = false;
    this.clickable_color = 0xf02011;
    this.clickable_opacity = 0.8;
    this.emissiveDefault = 0x000000;
    this.emissiveHighlight = 0x04CC00;

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
    this.endedLoading = this.endedLoading.bind(this);
    this.progressLoading = this.progressLoading.bind(this);
    this.errorLoading = this.errorLoading.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
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
      case 'photo_360':
        window.location.hash = '/content/photo/index/' + target.id;
        break
      case 'two_photo':
        window.location.hash = '/content/two_photo/' + target.id;
        break
    }
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

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xebf8fc)

    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
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
    var controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;
    // need anohter line to work in render
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.008;
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
        this.mesh.scale.set(element.scale, element.scale, element.scale)
        this.mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot), THREE.Math.degToRad(element.z_rot))

        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        //console.log("Clickable room: " + element.file_name + ", uuid: " + this.mesh.uuid ", target: " + target: element.target);
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

      this.scene.add(sphere);

      /**
         * new by sprites
         */

      console.log(element);
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

        this.scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene.posi; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      }.bind(this))
    }.bind(this))

    console.log("Loaded models");
  }

  //Labels are created here.
  //passes in info on position, tag, size, where to go
  makeLabel(element) {
    if (!element.label) {
      return null;
    }

    //element.label = "Change all labels test";

    // for circle
    let divLabel = document.createElement('div');
    divLabel.className = 'label';

    // for line
    let divLine = document.createElement("div");
    divLine.className = "line";

    // for tag
    let divTag = document.createElement("div");
    if (element.target && element.target.id) {
      divTag.id = "tag_" + element.target.id;
    }
    divTag.style.backgroundColor = 'blue';
    divTag.className = "tag";
    divTag.innerHTML = element.label;
    divTag.onclick = (event) => this.onClickLabel(element.target);

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
    return label;
  }

  renderMod() {
    this.camera.lookAt(this.cameraTarget);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children);

    for (var i = 0; i < intersects.length; i++) {
      this.clickable.forEach(function (element) {
        if (intersects[i].object.uuid === element.uuid) {
          this.highlighted = true;
          if (this.INTERSECTED != intersects[i].object) {
            if (this.INTERSECTED) { this.unmark(this.INTERSECTED) }
            this.INTERSECTED = intersects[i].object
            this.mark(this.INTERSECTED)
          }
        } else if (!this.highlighted) {
          if (this.INTERSECTED) { this.unmark(this.INTERSECTED) }
          this.INTERSECTED = null
        }
      }.bind(this))
    }
    this.highlighted = false
    if (intersects.length == 0) {
      if (this.INTERSECTED) { this.unmark(this.INTERSECTED) }
      this.INTERSECTED = null
    }

    this.directionalLight.position.copy(this.camera.position);
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  getTarget() {
    console.log("get target " + this.target);
    return this.target;
  }
}