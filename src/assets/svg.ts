// シンプルなSVGパス（ローポリ調）を文字列で管理

export const playerSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#61b0ff"/>
      <stop offset="100%" stop-color="#2c6bff"/>
    </linearGradient>
    <linearGradient id="heroTrail" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9be8ff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#2c6bff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="#0d1b3f" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M128 24 L148 60 L132 74 L142 94 L126 112 L110 94 L120 74 L104 60 Z" fill="url(#heroBody)"/>
    <path d="M128 112 C140 136 146 166 146 196 L110 196 C110 166 116 136 128 112 Z" fill="#f5c78b"/>
    <path d="M128 196 L156 232 L100 232 Z" fill="url(#heroTrail)" stroke="#2c6bff" stroke-width="4" />
    <circle cx="128" cy="50" r="10" fill="#f9d29d" />
    <path d="M124 46 C124 42 128 40 132 42 L140 48 C144 50 144 56 140 58 L132 62 C128 64 124 62 124 58 Z" fill="#1f1f2e"/>
    <path d="M118 74 L138 74 L128 86 Z" fill="#f9f9f9"/>
  </g>
</svg>
`

export const enemySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="core" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="100%" stop-color="#ffa94d"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="#0d0d16" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M32 138 L80 118 L128 126 L176 118 L224 138 L128 200 Z" fill="#dfe6f5"/>
    <path d="M64 118 L128 86 L192 118 L128 150 Z" fill="#c2d4f2"/>
    <circle cx="128" cy="126" r="26" fill="url(#core)" stroke="#222a4a" stroke-width="10"/>
    <path d="M64 118 L92 126 L64 134 Z" fill="#9bb3f0"/>
    <path d="M192 118 L164 126 L192 134 Z" fill="#9bb3f0"/>
  </g>
</svg>
`
