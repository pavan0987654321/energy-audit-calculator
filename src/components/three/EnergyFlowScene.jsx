import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * Responsive particle count
 */
const getParticleCount = () => {
    if (typeof window === 'undefined') return 1200;
    const width = window.innerWidth;
    if (width < 640) return 800;
    if (width < 1024) return 1000;
    if (width < 1920) return 1400;
    return 1800;
};

/**
 * Premium Particle Sphere - Anti-Gravity Physics Implementation
 */
const ParticleSphere = React.memo(({ mousePos }) => {
    const pointsRef = useRef();
    const velocitiesRef = useRef(null);

    const [particleCount, setParticleCount] = useState(getParticleCount);

    useEffect(() => {
        const handleResize = () => setParticleCount(getParticleCount());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize particles and physics state
    const particleData = useMemo(() => {
        const count = particleCount;
        const positions = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        // Physics state
        const velocities = new Float32Array(count * 3);
        const densities = new Float32Array(count); // Individual mass/weight

        // Professional Enterprise Palette (Indigo/Teal)
        const primaryColor = new THREE.Color('#6366F1');   // Indigo
        const secondaryColor = new THREE.Color('#14B8A6'); // Teal
        const accentColor = new THREE.Color('#8B5CF6');    // Purple
        const dimColor = new THREE.Color('#4F46E5');       // Darker indigo

        const sphereRadius = 2.0;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Fibonacci sphere distribution
            const theta = 2 * Math.PI * i / goldenRatio;
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);

            const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
            const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
            const z = sphereRadius * Math.cos(phi);

            // Set initial and base positions
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            originalPositions[i3] = x;
            originalPositions[i3 + 1] = y;
            originalPositions[i3 + 2] = z;

            // Initialize velocities to 0
            velocities[i3] = 0;
            velocities[i3 + 1] = 0;
            velocities[i3 + 2] = 0;

            // Density (random weight for variation)
            densities[i] = (Math.random() * 20) + 1;

            // Sizes
            sizes[i] = 0.04 + Math.random() * 0.06;

            // Colors
            const colorRand = Math.random();
            let particleColor;
            if (colorRand < 0.35) particleColor = primaryColor.clone().lerp(dimColor, Math.random() * 0.5);
            else if (colorRand < 0.55) particleColor = secondaryColor.clone().lerp(dimColor, Math.random() * 0.4);
            else if (colorRand < 0.8) particleColor = accentColor.clone().lerp(dimColor, Math.random() * 0.5);
            else particleColor = primaryColor.clone();

            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;
        }

        // Store physics state in ref for direct access in loop
        velocitiesRef.current = {
            array: velocities,
            densities: densities,
            originalPositions: originalPositions // Keep reference here too
        };

        return { positions, originalPositions, sizes, colors, count, sphereRadius };
    }, [particleCount]);

    // Shader for visuals (Logic moved to CPU)
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uMouse: { value: new THREE.Vector3(999, 999, 0) }, // Used for lighting only now
            },
            vertexShader: `
                attribute float aSize;
                attribute vec3 aColor;
                varying vec3 vColor;
                varying float vDistance;
                uniform float uPixelRatio;

                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                    
                    float sizeAttenuation = (1.0 / -viewPosition.z);
                    gl_PointSize = aSize * 450.0 * uPixelRatio * sizeAttenuation;
                    gl_PointSize = clamp(gl_PointSize, 2.0, 100.0);
                    
                    vColor = aColor;
                    vDistance = -viewPosition.z;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vDistance;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    
                    if (alpha < 0.01) discard;
                    
                    // Simple depth fade
                    float depthFade = clamp(1.0 - (vDistance - 3.0) * 0.06, 0.6, 1.0);
                    
                    gl_FragColor = vec4(vColor, alpha * depthFade * 0.9);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true,
        });
    }, []);

    // PHYSICS ANIMATION LOOP (CPU)
    useFrame(({ clock }) => {
        if (!pointsRef.current || !velocitiesRef.current) return;

        const time = clock.getElapsedTime();
        const geometry = pointsRef.current.geometry;
        const positions = geometry.attributes.position.array;
        const count = particleData.count;

        // Physics State
        const velocities = velocitiesRef.current.array;
        const densities = velocitiesRef.current.densities;
        const homes = velocitiesRef.current.originalPositions;

        // Mouse World Position (Calculated in parent)
        // Scale factor: Scene is approx 7 units wide? 
        // We tracked normalized coordinates, let's map loosely to world units
        const mouseX = mousePos.current.x * 3.5;
        const mouseY = mousePos.current.y * 3.5;
        // Mouse Z assumed 0 (or close to surface)

        // Interaction Constants
        const interactions = {
            mouseRadius: 2.5,    // Radius of influence
            accel: 0.12,         // Acceleration factor
            friction: 0.92,      // Damping (0.85 = more friction, 0.95 = slippery)
            returnSpeed: 0.04    // Elasticity strength
        };

        // Smooth Rotation Logic (Base)
        if (!pointsRef.current.smoothRotation) {
            pointsRef.current.smoothRotation = { x: 0, y: 0 };
        }
        const targetRotX = (mousePos.current.normalizedY || 0) * 0.3;
        const targetRotY = (mousePos.current.normalizedX || 0) * 0.3;
        pointsRef.current.smoothRotation.x += (targetRotX - pointsRef.current.smoothRotation.x) * 0.05;
        pointsRef.current.smoothRotation.y += (targetRotY - pointsRef.current.smoothRotation.y) * 0.05;

        // Base rotation of the container
        pointsRef.current.rotation.y = (time * 0.05) + pointsRef.current.smoothRotation.y;
        pointsRef.current.rotation.x = pointsRef.current.smoothRotation.x;

        // Reverse rotation matrix to apply mouse force in local space? 
        // Simplification: We will apply physics in LOCAL space, 
        // treating mouse position as relative to the un-rotated sphere for interaction
        // OR we just push particles based on their world position approximation.
        // Let's do simple: Apply physics to the `positions` array which is LOCAL space.
        // So we need to rotate the Mouse Position into Local Space to interact correctly!

        // Inverse rotation for mouse logic
        const cosY = Math.cos(-pointsRef.current.rotation.y);
        const sinY = Math.sin(-pointsRef.current.rotation.y);
        const cosX = Math.cos(-pointsRef.current.rotation.x);
        const sinX = Math.sin(-pointsRef.current.rotation.x);

        // Rotate mouse (Approximate inverse)
        // This is tricky without matrices, but for a sphere simple 2D rotation helps
        // Actually, let's just use the raw mouse vs raw position distance for the "force field"
        // It might feel slightly offset if spinning fast, but for slow spin it's fine.

        // Physics Loop
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            let px = positions[i3];
            let py = positions[i3 + 1];
            let pz = positions[i3 + 2];

            // 1. Calculate Distance from Mouse (Assuming mouse acts in local space approx)
            // A better way is: Mouse is at World (mx, my, 0). Particle is at Model (px, py, pz).
            // We should ideally project, but let's try direct distance first or global interaction.
            // Repulsion works best if we treat it as "disturbing the field".

            let dx = mouseX - px;
            let dy = mouseY - py;
            let dz = 0 - pz; // Mouse is at Z=0 plane roughly

            // Distance squared is faster
            let distSq = dx * dx + dy * dy + dz * dz;
            let dist = Math.sqrt(distSq);

            // 2. Anti-Gravity (Repulsion)
            if (dist < interactions.mouseRadius) {
                const force = (interactions.mouseRadius - dist) / interactions.mouseRadius;
                const dirX = dx / dist;
                const dirY = dy / dist;
                const dirZ = dz / dist;

                // Push AWAY
                velocities[i3] -= dirX * force * interactions.accel * 5.0; // Boosted force
                velocities[i3 + 1] -= dirY * force * interactions.accel * 5.0;
                velocities[i3 + 2] -= dirZ * force * interactions.accel * 5.0;
            } else {
                // 3. Return to Home (Elasticity)
                // Vector to home
                let hx = homes[i3] - px;
                let hy = homes[i3 + 1] - py;
                let hz = homes[i3 + 2] - pz;

                velocities[i3] += hx * interactions.returnSpeed;
                velocities[i3 + 1] += hy * interactions.returnSpeed;
                velocities[i3 + 2] += hz * interactions.returnSpeed;
            }

            // 4. Friction
            velocities[i3] *= interactions.friction;
            velocities[i3 + 1] *= interactions.friction;
            velocities[i3 + 2] *= interactions.friction;

            // Apply Velocity
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];
        }

        geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} material={shaderMaterial}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleData.count}
                    array={particleData.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    count={particleData.count}
                    array={particleData.sizes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-aColor"
                    count={particleData.count}
                    array={particleData.colors}
                    itemSize={3}
                />
            </bufferGeometry>
        </points>
    );
});


/**
 * Scene with premium visual effects
 */
const Scene = React.memo(({ isVisible, mousePos }) => {
    return (
        <>
            <ParticleSphere mousePos={mousePos} />

            <EffectComposer>
                <Bloom
                    intensity={1.0}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur={true}
                    radius={0.6}
                />
            </EffectComposer>
        </>
    );
});

/**
 * Fallback
 */
const FallbackBackground = React.memo(() => (
    <div
        className="absolute inset-0"
        style={{
            background: 'radial-gradient(ellipse at 70% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        }}
    />
));

/**
 * Performance check
 */
const usePerformanceCheck = () => {
    const [shouldUse3D, setShouldUse3D] = useState(true);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setShouldUse3D(!!gl && !prefersReducedMotion);
    }, []);

    return shouldUse3D;
};

/**
 * Main Export - NO visible box, seamless integration
 */
const EnergyFlowScene = React.memo(({ className = '' }) => {
    const shouldUse3D = usePerformanceCheck();
    const containerRef = useRef();
    const [isVisible, setIsVisible] = useState(true);
    const mousePos = useRef({ x: 0, y: 0, active: false });

    // Mouse tracking
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const containerRect = container.getBoundingClientRect();

            // Sphere center position
            const sphereCenterX = containerRect.right - 240;
            const sphereCenterY = containerRect.top + containerRect.height / 2;

            // Dictionary tracking for magnetic effect
            const dx = e.clientX - sphereCenterX;
            const dy = e.clientY - sphereCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Normalized coordinates for screen-wide rotation (-1 to 1)
            mousePos.current.normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.current.normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;

            // Store distance for glow intensity calculation
            mousePos.current.distance = distance;
            mousePos.current.active = distance < 300;
            mousePos.current.x = dx / 80;
            mousePos.current.y = -dy / 80;
        };

        const handleMouseLeave = () => {
            mousePos.current.active = false;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Visibility observer
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    if (!shouldUse3D) {
        return <FallbackBackground />;
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-visible ${className}`}
            style={{
                pointerEvents: 'auto',
                // NO border, NO box shadow - completely seamless
            }}
        >
            {/* Sphere - NO visible container box */}
            <div
                style={{
                    position: 'absolute',
                    right: '3%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '460px',
                    height: '460px',
                    // NO border, NO background, NO shadow
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    outline: 'none',
                }}
            >
                <Canvas
                    camera={{ position: [0, 0, 5.5], fov: 50 }}
                    dpr={[1, 2]}
                    frameloop={isVisible ? "always" : "demand"}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                        stencil: false,
                    }}
                    style={{
                        background: 'transparent',
                        // Ensure canvas has no visible border
                        border: 'none',
                        outline: 'none',
                    }}
                >
                    <Scene isVisible={isVisible} mousePos={mousePos} />
                </Canvas>
            </div>
        </div>
    );
});

export default EnergyFlowScene;
