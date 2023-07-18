
import React, { FC, useEffect, useRef } from 'react'
import {AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import WebGL from './lib/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const SceneWithRefComp: FC = () => {
  const domRef = useRef<HTMLDivElement>(null)
  const scene =  useRef<Scene>() 
  const camera = useRef<PerspectiveCamera>()
  const renderer = useRef<WebGLRenderer>()
  const orbitControl = useRef<OrbitControls>()
  const geometry = useRef<BoxGeometry>()
  const material = useRef<MeshBasicMaterial>()
  const axesHelper = useRef<AxesHelper>() 
  const cube = useRef<Mesh>()
  if(!camera.current) {
    scene.current = new Scene()
     camera.current =  new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
     renderer.current = new WebGLRenderer()
     orbitControl.current = new OrbitControls( camera.current, renderer.current.domElement );
     axesHelper.current = new AxesHelper( 5 ) 
     geometry.current =  new BoxGeometry( 1, 1, 1 );
     material.current = new MeshBasicMaterial( { color: 0x00ff00 } );
     cube.current = new Mesh( geometry.current, material.current );
    renderer.current.setSize( window.innerWidth, window.innerHeight );
    scene.current.add(cube.current)
    scene.current.add(axesHelper.current)
    camera.current.position.z = 5;
    orbitControl.current.update();
    orbitControl.current.enableDamping = true
  }


  useEffect(() => {
    const container = domRef.current
    const dom = renderer.current?.domElement
    
    function animate() {
      if(cube.current && orbitControl.current && renderer.current && scene.current && camera.current) {
        requestAnimationFrame( animate );
        cube.current.rotation.x += 0.01;
        cube.current.rotation.y += 0.01;
        cube.current.rotation.z += 0.01;
        orbitControl.current.update()
  
        renderer.current.render(scene.current, camera.current)
      }


    }
    if(WebGL.isWebGLAvailable()) {
      animate();
    }else {
      const warning = WebGL.getWebGLErrorMessage();
      document.body.appendChild(warning);
    }

    if(dom)
    container?.appendChild(dom) 
    return () => {
      if(dom)
      container?.removeChild(dom)
    }
  })


  return <div ref={domRef}></div>
}

export default SceneWithRefComp