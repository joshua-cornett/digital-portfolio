import { Text } from '@react-three/drei';
import React from 'react';

/**
 * Panel3D renders a neon green outlined panel with glowing text in R3F.
 * @param {Object} props
 * @param {[number, number, number]} props.position - 3D position
 * @param {[number, number]} props.size - [width, height]
 * @param {string} [props.label] - Optional label
 * @param {string} [props.children] - Panel content (string)
 * @param {number} [props.labelFontSize] - Font size for label
 * @param {number} [props.contentFontSize] - Font size for content
 * @param {string} [props.labelAnchorX] - Text anchorX for label
 * @param {string} [props.contentAnchorX] - Text anchorX for content
 */
const Panel3D = ({
  position = [0, 0, 0],
  size = [2, 1],
  label,
  children,
  labelFontSize = 0.32,
  contentFontSize = 0.28,
  labelAnchorX = 'left',
  contentAnchorX = 'left'
}) => {
  return (
    <group position={position}>
      {/* Neon green outlined rectangle */}
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Glowing border (slightly larger) */}
      <mesh>
        <planeGeometry args={[size[0] * 1.04, size[1] * 1.08]} />
        <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.12} />
      </mesh>
      {/* Label */}
      {label && (
        <Text
          position={[0, size[1] / 2 - labelFontSize * 0.7, 0.01]}
          fontSize={labelFontSize}
          color="#00ff00"
          font="/fonts/PressStart2P-Regular.ttf"
          anchorX={labelAnchorX}
          anchorY="top"
          outlineColor="#00ff00"
          outlineWidth={0.012}
        >
          {label}
        </Text>
      )}
      {/* Content */}
      {children && (
        <Text
          position={[0, label ? size[1] / 2 - labelFontSize * 1.4 : 0, 0.01]}
          fontSize={contentFontSize}
          color="#00ff00"
          font="/fonts/PressStart2P-Regular.ttf"
          anchorX={contentAnchorX}
          anchorY={label ? 'top' : 'middle'}
          maxWidth={size[0] * 0.9}
          outlineColor="#00ff00"
          outlineWidth={0.01}
        >
          {children}
        </Text>
      )}
    </group>
  );
};

export default Panel3D;
