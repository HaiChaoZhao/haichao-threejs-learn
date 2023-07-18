
import React, { FC, useEffect, useRef } from 'react'
import {AxesHelper, BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import WebGL from './lib/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import dat from 'dat.gui'
import gsap from 'gsap'



export const SceneComp: FC = () => {
  const domRef = useRef<HTMLDivElement>(null)
  const scene =  new Scene()
  const camera =  new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
  const renderer = new WebGLRenderer()
  const orbitControl = new OrbitControls( camera, renderer.domElement );
  const geometry =  new BoxGeometry( 1, 1, 1 );
  const material = new MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new Mesh( geometry, material );
  const axesHelper = new AxesHelper( 5 ) 

  renderer.setSize( window.innerWidth, window.innerHeight );
  scene.add(cube)
  scene.add(axesHelper)
  camera.position.z = 5;
  orbitControl.update();
  orbitControl.enableDamping = true
    
  function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    orbitControl.update()

    renderer.render(scene, camera)

  }
  if(WebGL.isWebGLAvailable()) {
    animate();
  }else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
  }

  useEffect(() => {
    const container = domRef.current
    const dom = renderer?.domElement
    const gui = new dat.GUI()
    const folder = gui.addFolder('设置立方体')
    folder.add(cube.material, 'wireframe',)
    folder.add(cube.position, 'x').min(0).max(5).step(0.01).name('移动X轴')
    const params = {
      color: 0x00ff00,
      fn: () => {
        console.log('执行函数')
        gsap.to(cube.position, {x: 5, duration: 2, yoyo: true, repeat: -1})
      }
    }
    folder.addColor(params, 'color').onChange((val: number) => {
      cube.material.color.set(val)
    }).name('材质颜色')
    folder.add(cube, 'visible').name('是否显示')
    folder.add(params, 'fn').name('立方体运动')
    gui.domElement.addEventListener('dblclick', (e)=> {
      e.stopPropagation()
    })
    const handleResize = () => {

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setPixelRatio(window.devicePixelRatio)
    }
    
    const handleFullScreen = () => {
      const fullScreenEl = document.fullscreenElement
      if(fullScreenEl) {
        document.exitFullscreen().catch((reason) => {
          alert(reason)
        })

      }else {
        renderer.domElement.requestFullscreen().catch((reason) => {
          alert(reason)
        })
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('dblclick',handleFullScreen)
    if(dom)
    container?.appendChild(dom) 
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('dblclick',handleFullScreen)
      if(dom)
        container?.removeChild(dom)
      
      gui.destroy()

    }
  })


  return <div ref={domRef}></div>
}

export default SceneComp