// シンプルなSVGパス（ローポリ調）を文字列で管理

export const playerSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroCore" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6de1ff"/>
      <stop offset="100%" stop-color="#1f66ff"/>
    </linearGradient>
    <linearGradient id="heroJet" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd166"/>
      <stop offset="100%" stop-color="#ff6b6b"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="#0b1233" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M128 26 L156 70 L132 92 L150 118 L128 140 L106 118 L124 92 L100 70 Z" fill="url(#heroCore)"/>
    <path d="M128 140 C146 166 156 194 156 220 L100 220 C100 194 110 166 128 140 Z" fill="#f5c78b"/>
    <path d="M128 220 L168 244 L88 244 Z" fill="url(#heroJet)" stroke="#ff8c42" stroke-width="5"/>
    <circle cx="128" cy="60" r="12" fill="#f5e6c7"/>
    <path d="M118 56 C118 50 124 46 130 48 L148 54 C154 56 154 64 148 66 L130 72 C124 74 118 70 118 64 Z" fill="#0f1a33"/>
    <path d="M118 96 L138 96 L128 110 Z" fill="#e8f4ff"/>
    <path d="M128 140 L140 172 L116 172 Z" fill="#70c1ff"/>
  </g>
</svg>
`

export const enemySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="core" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff9f43"/>
      <stop offset="100%" stop-color="#ff4d6d"/>
    </linearGradient>
    <linearGradient id="wing" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d8e6ff"/>
      <stop offset="100%" stop-color="#8ea7ff"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="#0d0d16" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
    <path d="M32 150 L96 110 L128 124 L160 110 L224 150 L128 214 Z" fill="url(#wing)"/>
    <path d="M70 116 L128 80 L186 116 L128 152 Z" fill="#c2cff7"/>
    <circle cx="128" cy="128" r="26" fill="url(#core)" stroke="#1c2545" stroke-width="12"/>
    <path d="M68 130 L96 136 L80 148 Z" fill="#9bb3f0"/>
    <path d="M188 130 L160 136 L176 148 Z" fill="#9bb3f0"/>
  </g>
</svg>
`
