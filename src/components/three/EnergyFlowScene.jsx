import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Premium Floating Core - Smaller, positioned to the side
 */
const FloatingCore = React.memo(({ isHovered }) => {
    const groupRef = useRef();
    const coreRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();
    const ring3Ref = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Main group rotation
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.15;
        }

        // Core pulse
        if (coreRef.current) {
            const pulse = 1 + Math.sin(t * 0.8) * 0.05;
            const hover = isHovered ? 1.1 : 1;
            coreRef.current.scale.setScalar(pulse * hover);
            coreRef.current.rotation.x = t * 0.2;
            coreRef.current.rotation.z = t * 0.15;
        }

        // Ring rotations
        if (ring1Ref.current) {
            ring1Ref.current.rotation.z = t * 0.3;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.z = -t * 0.2;
        }
        if (ring3Ref.current) {
            ring3Ref.current.rotation.x = t * 0.25;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ambient glow */}
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial
                    color={isHovered ? "#8B5CF6" : "#6366F1"}
                    transparent
                    opacity={isHovered ? 0.12 : 0.08}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Ring 1 - Teal */}
            <group ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
                <mesh>
                    <torusGeometry args={[1.0, 0.015, 16, 64]} />
                    <meshBasicMaterial
                        color="#14B8A6"
                        transparent
                        opacity={isHovered ? 0.9 : 0.6}
                    />
                </mesh>
            </group>

            {/* Ring 2 - Violet */}
            <group ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
                <mesh>
                    <torusGeometry args={[0.8, 0.012, 16, 64]} />
                    <meshBasicMaterial
                        color="#8B5CF6"
                        transparent
                        opacity={isHovered ? 0.8 : 0.5}
                    />
                </mesh>
            </group>

            {/* Ring 3 - Indigo */}
            <group ref={ring3Ref} rotation={[0, Math.PI / 6, 0]}>
                <mesh>
                    <torusGeometry args={[1.2, 0.01, 16, 64]} />
                    <meshBasicMaterial
                        color="#6366F1"
                        transparent
                        opacity={isHovered ? 0.7 : 0.4}
                    />
                </mesh>
            </group>

            {/* Core - Glowing dodecahedron */}
            <mesh ref={coreRef}>
                <dodecahedronGeometry args={[0.4, 0]} />
                <meshBasicMaterial
                    color={isHovered ? "#A78BFA" : "#6366F1"}
                    transparent
                    opacity={isHovered ? 0.95 : 0.8}
                />
            </mesh>

            {/* Center point */}
            <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
});

/**
 * Main Scene
 */
const Scene = React.memo(({ isVisible }) => {
    const [isHovered, setIsHovered] = useState(false);
    const groupRef = useRef();
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        if (!isVisible || !groupRef.current) return;
        groupRef.current.rotation.y += (mousePos.current.x * 0.2 - groupRef.current.rotation.y) * 0.02;
        groupRef.current.rotation.x += (-mousePos.current.y * 0.1 - groupRef.current.rotation.x) * 0.02;
    });

    return (
        <group
            ref={groupRef}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <FloatingCore isHovered={isHovered} />
        </group>
    );
});

/**
 * Fallback Background
 */
const FallbackBackground = React.memo(() => (
    <div
        className="absolute inset-0"
        style={{
            background: 'radial-gradient(ellipse at 70% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
        }}
    />
));

/**
 * Performance Check
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
 * Main Export - Positioned to the right side
 */
const EnergyFlowScene = React.memo(({ className = '' }) => {
    const shouldUse3D = usePerformanceCheck();
    const containerRef = useRef();
    const [isVisible, setIsVisible] = useState(true);

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
            className={`absolute inset-0 ${className}`}
            style={{
                pointerEvents: 'none',
            }}
        >
            {/* Subtle gradient background only */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse at 75% 40%, rgba(99, 102, 241, 0.06) 0%, transparent 40%),
                        radial-gradient(ellipse at 25% 60%, rgba(20, 184, 166, 0.04) 0%, transparent 35%)
                    `,
                }}
            />

            {/* 3D Canvas - positioned to right side */}
            <div
                className="absolute"
                style={{
                    right: '5%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '300px',
                    height: '300px',
                    pointerEvents: 'auto',
                }}
            >
                <Suspense fallback={null}>
                    <Canvas
                        camera={{ position: [0, 0, 4], fov: 45 }}
                        dpr={[1, 2]}
                        frameloop={isVisible ? "always" : "demand"}
                        gl={{
                            antialias: true,
                            alpha: true,
                            powerPreference: 'high-performance',
                        }}
                        style={{ background: 'transparent' }}
                    >
                        <Scene isVisible={isVisible} />
                    </Canvas>
                </Suspense>
            </div>
        </div>
    );
});

export default EnergyFlowScene;
