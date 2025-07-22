import React, { useEffect, useRef } from 'react'

// - This component renders a Three.js ASCII effect scene (bouncing sphere on a plane, in ASCII art!)
// - It uses imperative Three.js code inside a React component
// - All DOM manipulation is handled in a ref div (not the whole document body)
// - Cleans up on unmount

function Model() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Import Three.js and addons dynamically (so SSR doesn't break)
        let renderer: any, effect: any, controls: any, animationId: number
        let camera: any, scene: any, sphere: any, plane: any
        let start = Date.now()

        let cleanupFns: (() => void)[] = []

        let mounted = true

        async function init() {
            // Dynamically import Three.js and addons
            const THREE = await import('three')
            // @ts-ignore
            const { AsciiEffect } = await import('three/examples/jsm/effects/AsciiEffect.js')
            // @ts-ignore
            const { TrackballControls } = await import('three/examples/jsm/controls/TrackballControls.js')

            // Camera
            camera = new THREE.PerspectiveCamera(70, 1, 1, 1000)
            camera.position.y = 150
            camera.position.z = 500

            // Scene
            scene = new THREE.Scene()
            scene.background = new THREE.Color(0, 0, 0)

            // Lights
            const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0)
            pointLight1.position.set(500, 500, 500)
            scene.add(pointLight1)

            const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0)
            pointLight2.position.set(-500, -500, -500)
            scene.add(pointLight2)

            // Sphere
            sphere = new THREE.Mesh(
                new THREE.SphereGeometry(200, 20, 10),
                new THREE.MeshPhongMaterial({ flatShading: true })
            )
            scene.add(sphere)

            // Plane
            plane = new THREE.Mesh(
                new THREE.PlaneGeometry(400, 400),
                new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
            )
            plane.position.y = -200
            plane.rotation.x = -Math.PI / 2
            scene.add(plane)

            // Renderer
            renderer = new THREE.WebGLRenderer()
            renderer.setSize(512, 512) // Default size, will resize below

            // ASCII Effect
            effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
            effect.setSize(512, 512)
            effect.domElement.style.color = 'white'
            effect.domElement.style.backgroundColor = 'black'
            effect.domElement.style.width = '100%'
            effect.domElement.style.height = '100%'
            effect.domElement.style.display = 'block'

            // Controls
            controls = new TrackballControls(camera, effect.domElement)

            // Attach to container
            if (containerRef.current && mounted) {
                containerRef.current.appendChild(effect.domElement)
            }

            // Handle resize
            function handleResize() {
                if (!containerRef.current) return
                const width = containerRef.current.offsetWidth
                const height = containerRef.current.offsetHeight
                camera.aspect = width / height
                camera.updateProjectionMatrix()
                renderer.setSize(width, height)
                effect.setSize(width, height)
            }
            window.addEventListener('resize', handleResize)
            cleanupFns.push(() => window.removeEventListener('resize', handleResize))

            // Initial resize
            handleResize()

            // Animation loop
            function animate() {
                const timer = Date.now() - start
                sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150
                sphere.rotation.x = timer * 0.0003
                sphere.rotation.z = timer * 0.0002
                controls.update()
                effect.render(scene, camera)
                animationId = requestAnimationFrame(animate)
            }
            animate()
            cleanupFns.push(() => cancelAnimationFrame(animationId))
        }

        init()

        // Cleanup on unmount
        return () => {
            mounted = false
            cleanupFns.forEach(fn => fn())
            if (containerRef.current && effect?.domElement) {
                try {
                    containerRef.current.removeChild(effect.domElement)
                } catch { }
            }
            // Dispose Three.js objects if possible
            controls?.dispose?.()
            renderer?.dispose?.()
        }
    }, [])

    // The container div will fill its parent. Set a min height for visibility.
    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '400px',
                minHeight: '300px',
                background: 'black',
                overflow: 'hidden',
                position: 'relative',
            }}
            aria-label="ASCII Sphere Three.js Scene"
        />
    )
}

export default Model