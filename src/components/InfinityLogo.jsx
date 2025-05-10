import React from 'react';

const InfinityLogo = ({ width = 120, height = 60 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 240 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="infinity-gradient" x1="0" y1="60" x2="240" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3a1c71" />
        <stop offset="0.5" stopColor="#d76d77" />
        <stop offset="1" stopColor="#ffaf7b" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M60,60 C60,20 120,20 120,60 C120,100 180,100 180,60 C180,20 120,20 120,60 C120,100 60,100 60,60 Z"
      stroke="url(#infinity-gradient)"
      strokeWidth="16"
      fill="none"
      filter="url(#glow)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InfinityLogo; 