/** Hillside cross-section: water at the foot of the slope, the house built into the hill, the street above it. */
export function SideDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 320"
      role="img"
      aria-label="Cross-section of the hillside. The Bosphorus lies at the foot of the slope on the left. The house is built into the hill: its water-side rooms face downhill to the strait, and its city-side rooms face the street at the top of the hill on the right."
      className={className}
    >
      <defs>
        <linearGradient id="diagram-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1dfbd" />
          <stop offset="1" stopColor="#faf3e6" />
        </linearGradient>
        <linearGradient id="diagram-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d6a8f" />
          <stop offset="1" stopColor="#1f4466" />
        </linearGradient>
      </defs>
      <rect width="640" height="320" fill="url(#diagram-sky)" />

      <path d="M0 222 L70 206 L120 214 L170 200 L215 212 L215 320 L0 320 Z" fill="#b9c6c9" opacity=".7" />
      <path d="M0 236 L226 236 L226 320 L0 320 Z" fill="url(#diagram-water)" />
      <g stroke="#9fc1d8" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8">
        <path d="M18 256 q10 -7 20 0 t20 0 t20 0" />
        <path d="M96 276 q10 -7 20 0 t20 0 t20 0" />
        <path d="M40 298 q10 -7 20 0 t20 0 t20 0" />
      </g>

      <g>
        <rect x="292" y="86" width="152" height="96" rx="3" fill="#f8f0df" stroke="#8b7448" strokeWidth="2" />
        <path d="M284 88 L368 56 L452 88 Z" fill="#a1583c" />
        <rect x="292" y="182" width="40" height="26" fill="#cdb98f" stroke="#8b7448" strokeWidth="2" />
        {[0, 1].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={306 + col * 34}
              y={100 + row * 38}
              width="20"
              height="26"
              rx="2"
              fill={col === 0 ? "#2a5c86" : "#74879a"}
            />
          )),
        )}
      </g>

      <path d="M226 236 L226 232 C262 226 292 210 330 184 C372 156 400 128 440 112 C500 90 570 84 640 82 L640 320 L226 320 Z" fill="#d9c7a0" />
      <path d="M330 184 C372 156 400 128 440 112 C500 90 570 84 640 82" fill="none" stroke="#8b7448" strokeWidth="3" />
      <path d="M440 108 C500 86 570 80 640 78" fill="none" stroke="#5f6b75" strokeWidth="7" strokeLinecap="round" />
      <path d="M440 108 C500 86 570 80 640 78" fill="none" stroke="#f8f0df" strokeWidth="1.5" strokeDasharray="8 8" />

      <g fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M286 126 C262 126 246 160 222 192" stroke="#1f4466" strokeDasharray="1 7" />
        <path d="M228 196 L221 190 L229 186" stroke="#1f4466" />
        <path d="M450 142 C470 142 486 128 506 112" stroke="#5b4a2a" strokeDasharray="1 7" />
      </g>

      <g fontFamily="var(--font-source-sans), system-ui, sans-serif">
        <text x="20" y="48" fontSize="19" fontWeight="700" fill="#0b2238">Bosphorus side</text>
        <text x="20" y="70" fontSize="14" fill="#32465a">Deluxe · Suite · Bosfor Suite</text>
        <text x="20" y="90" fontSize="13" fill="#32465a">Downhill, facing the water</text>
        <text x="372" y="34" fontSize="19" fontWeight="700" fill="#0b2238">City side</text>
        <text x="372" y="54" fontSize="14" fill="#32465a">Standard · Queens · Kings</text>
        <text x="512" y="132" fontSize="13" fill="#5b4a2a">Hillside street</text>
        <text x="118" y="258" fontSize="13" fill="#dbe8f1">The Bosphorus</text>
      </g>
    </svg>
  )
}
