// src/components/common/LogoSvg.tsx
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface LogoSvgProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export default function LogoSvg({ 
  width = 60, 
  height = 60,
  backgroundColor = '#A4F047',
  iconColor = '#1A1D1E'
}: LogoSvgProps) {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200"
      fill="none"
    >
      {/* Fundo verde com cantos arredondados */}
      <Rect
        x="0"
        y="0"
        width="200"
        height="200"
        rx="40"
        fill={backgroundColor}
      />
      
      {/* Primeira linha (maior) */}
      <Path
        d="M40 50 L160 50 Q180 50, 180 70 Q180 90, 160 90 L40 90 Q20 90, 20 70 Q20 50, 40 50 Z"
        fill={iconColor}
      />
      
      {/* Segunda linha (média) */}
      <Path
        d="M50 105 L150 105 Q165 105, 165 120 Q165 135, 150 135 L50 135 Q35 135, 35 120 Q35 105, 50 105 Z"
        fill={iconColor}
      />
      
      {/* Terceira linha (menor) */}
      <Path
        d="M60 150 L120 150 Q135 150, 135 162.5 Q135 175, 120 175 L60 175 Q45 175, 45 162.5 Q45 150, 60 150 Z"
        fill={iconColor}
      />
    </Svg>
  );
}
