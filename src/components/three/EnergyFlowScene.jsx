import React, { useRef, useEffect } from 'react';

const EnergyFlowScene = ({ className = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration (Mutable for responsiveness)
        let config = {
            particleCount: 1000,
            sphereRadius: 220,
            mouseRadius: 200,
            trailColor: 'rgba(10, 10, 25, 0.25)',
            colors: ['#6366F1', '#14B8A6', '#8B5CF6', '#3B82F6'],
            centerXRatio: 0.70, // 70% width
            centerYRatio: 0.50
        };

        let particles = [];
        const mouse = { x: null, y: null };

        // Handle Resizing
        const handleResize = () => {
            const parent = canvas.parentElement;
            let width, height;

            if (parent) {
                width = parent.clientWidth;
                height = parent.clientHeight;
            } else {
                width = window.innerWidth;
                height = window.innerHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // RESPONSIVE LOGIC
            const windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                // Mobile: Smaller, shifted slightly up, centered horizontally
                config.particleCount = 600;
                config.sphereRadius = 90; // Decreased from 120
                config.mouseRadius = 100;
                config.centerXRatio = 0.5; // Center
                config.centerYRatio = 0.35; // Higher up
            } else if (windowWidth < 1280) {
                // Tablet/Laptop: Medium size, slightly right
                config.particleCount = 800;
                config.sphereRadius = 130; // Decreased from 180
                config.mouseRadius = 140;
                config.centerXRatio = 0.65;
                config.centerYRatio = 0.5;
            } else {
                // Desktop: Full size, right aligned
                config.particleCount = 1000;
                config.sphereRadius = 170; // Decreased from 220
                config.mouseRadius = 180;
                config.centerXRatio = 0.70;
                config.centerYRatio = 0.5;
            }

            initParticles();
        };

        // Mouse Tracker
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        class Particle {
            constructor(x, y, z, color) {
                this.baseX = x; // Original 3D positions
                this.baseY = y;
                this.baseZ = z;
                this.color = color;

                // Position logic happens in update()
                this.x = 0;
                this.y = 0;

                this.vx = 0;    // Velocity X
                this.vy = 0;    // Velocity Y
                this.friction = 0.94; // Higher friction for smoother feel
                this.ease = 0.04;     // Slower return for "heavy" fluid feel
            }

            update() {
                // 1. 3D to 2D Projection (Simple Perspective)
                // Dynamic Center based on responsive config
                const centerX = canvas.width * config.centerXRatio;
                const centerY = canvas.height * config.centerYRatio;

                const perspective = 350 / (350 + this.baseZ);
                const targetX = (this.baseX * perspective) + centerX;
                const targetY = (this.baseY * perspective) + centerY;

                // 2. Interaction (Anti-Gravity)
                // If mouse is active
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.mouseRadius) {
                        let force = (config.mouseRadius - dist) / config.mouseRadius;
                        // Push away with acceleration
                        this.vx -= (dx / dist) * force * 2.5; // Softer force
                        this.vy -= (dy / dist) * force * 2.5;
                    }
                }

                // Pull back to "Home" position smoothly
                this.vx += (targetX - this.x) * this.ease;
                this.vy += (targetY - this.y) * this.ease;

                // 3. Apply physics
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                // Depth-based size and opacity
                const depthRatio = (this.baseZ + config.sphereRadius) / (config.sphereRadius * 2); // 0 to 1
                const size = Math.max(0.5, (2.8 - (this.baseZ / 120)));
                const opacity = 0.4 + (0.6 * (1 - depthRatio)); // Closer = more opaque

                ctx.globalAlpha = opacity;
                ctx.fillStyle = this.color;

                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 1.0; // Reset
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                // Distribute particles evenly over a sphere surface
                let theta = Math.random() * 2 * Math.PI;
                let phi = Math.acos((Math.random() * 2) - 1);

                let x = config.sphereRadius * Math.sin(phi) * Math.cos(theta);
                let y = config.sphereRadius * Math.sin(phi) * Math.sin(theta);
                let z = config.sphereRadius * Math.cos(phi);

                const color = config.colors[Math.floor(Math.random() * config.colors.length)];
                particles.push(new Particle(x, y, z, color));
            }
        }

        function animate() {
            // Rich dark trail
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        }



        // Initialize
        handleResize();
        animate();

        // Listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove); // Track global mouse for better feel? 
        // Snippet tracked window. But here we need canvas-relative coordinates for the repulsion logic to match visual position.
        // If we track window, we must subtract canvas offset. We did that in handleMouseMove.

        // Listen to container/canvas specifically? 
        // The snippet used window. We'll use window for smoother tracking.

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`block absolute inset-0 w-full h-full ${className}`}
            style={{
                // Ensure it acts as a background if needed, but allow mouse events to pass if it's an overlay
                // However, interaction REQUIRES mouse position. 
                // We track mouse via window, so 'pointer-events: none' allows clicking buttons UNDER the canvas.
                pointerEvents: 'none'
            }}
        />
    );
};

export default EnergyFlowScene;
