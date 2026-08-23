"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function FluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Initialize Three.js objects
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // High resolution geometry for smooth liquid ripples
    const geometry = new THREE.PlaneGeometry(12, 10, 180, 180);

    const vertexShader = `
      uniform float u_time;
      uniform vec2 u_mouse;
      varying vec2 vUv;
      varying float vDisplacement;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      // Simplex 2D noise (Original Original)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; ++i) {
              v += a * snoise(p);
              p = p * 2.1 + vec2(50.0);
              a *= 0.5;
          }
          return v;
      }

      void main() {
          vUv = uv;
          vec2 p = position.xy * 0.4 + vec2(u_time * 0.05);
          float displacement = fbm(p + u_time * 0.06);
          
          float dist = distance(position.xy, vec2(u_mouse.x * 12.0 - 6.0, u_mouse.y * 10.0 - 5.0));
          float mouseEff = (1.0 - smoothstep(0.0, 3.5, dist)) * 0.5;
          displacement += mouseEff;

          vDisplacement = displacement;
          
          vec3 newPosition = position;
          newPosition.z += displacement * 1.0;

          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      varying vec2 vUv;
      varying float vDisplacement;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
          // 1. High-Precision Atmospheric Palette (Original Fluid Palette Preserved)
          vec3 col_warm = vec3(1.0, 0.65, 0.45);   // Sunset Orange (Base)
          vec3 col_sky = vec3(0.75, 0.85, 1.0);    // Sky Blue (Top)
          vec3 col_core = vec3(0.88, 0.82, 0.95);  // Pale Lavender (Cloud Core)

          // 2. Coordinate-Anchored Mixing Logic
          vec3 baseGradient = mix(col_warm, col_sky, smoothstep(0.0, 0.8, vUv.y));
          
          float cloudFactor = smoothstep(-0.6, 0.6, vDisplacement);
          vec3 color = mix(baseGradient, col_core, cloudFactor * 0.5);

          // 3. Subtle Atmospheric Lighting
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          vec3 lightDir = normalize(vec3(5.0, 5.0, 10.0));
          vec3 halfwayDir = normalize(lightDir + viewDir);

          float diff = max(dot(normal, lightDir), 0.0);
          float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);

          vec3 lighting = 0.95 * color + 0.05 * diff * col_sky + 0.08 * spec * vec3(1.0);
          
          float baseGlow = (1.0 - smoothstep(0.0, 0.5, vUv.y)) * cloudFactor;
          lighting += baseGlow * col_warm * 0.15;

          gl_FragColor = vec4(lighting, 1.0);
      }
    `;

    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.12;
    scene.add(mesh);

    camera.position.z = 5;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.u_mouse.value.x = (event.clientX - rect.left) / rect.width;
      uniforms.u_mouse.value.y = 1.0 - (event.clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Observer for production stability
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    const animate = (time: number) => {
      uniforms.u_time.value = time * 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();

      const gl = renderer.domElement.getContext('webgl2') || renderer.domElement.getContext('webgl');
      if (gl) {
        const extension = gl.getExtension('WEBGL_lose_context');
        if (extension) extension.loseContext();
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 opacity-100 pointer-events-none" />;
}
