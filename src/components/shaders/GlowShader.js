import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const GlowShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0x00ff00),
    isHovered: 0
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float isHovered;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create multiple waves
      float wave1 = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
      float wave2 = sin(dist * 8.0 - time * 1.5) * 0.5 + 0.5;
      float wave3 = sin(dist * 6.0 - time * 1.0) * 0.5 + 0.5;
      
      // Combine waves
      float waves = (wave1 + wave2 + wave3) / 3.0;
      
      // Create radial falloff
      float radialFalloff = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Final glow intensity
      float glowIntensity = waves * radialFalloff * isHovered;
      
      // Output color with glow
      gl_FragColor = vec4(color, glowIntensity * 0.6);
    }
  `
);
