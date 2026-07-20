/**
 * The snow-capped violet field from Violette's homepage mock, drawn as a
 * single inline SVG so it loads instantly and scales to any width.
 * Two layers of blooms give it depth; it's decorative, so it's hidden
 * from screen readers.
 */
export default function FlowerField({ hem = false }: { hem?: boolean }) {
  return (
    <div
      className={hem ? 'flower-field flower-field--hem' : 'flower-field'}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 230"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        focusable="false"
      >
        <defs>
          <g id="vm-bloom">
            {/* stem + leaves */}
            <path
              d="M0 118 C -3 92 3 66 0 44"
              stroke="#4c7a3f"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M0 92 C -16 88 -25 76 -27 64 C -14 68 -4 78 0 88 Z"
              fill="#568a47"
            />
            <path
              d="M1 100 C 15 97 24 87 27 76 C 15 79 5 88 1 97 Z"
              fill="#3f6a34"
            />
            {/* violet cluster */}
            <circle cx="-16" cy="38" r="12" fill="#8f63ac" />
            <circle cx="16" cy="38" r="12" fill="#8f63ac" />
            <circle cx="-9" cy="24" r="12" fill="#9d74be" />
            <circle cx="9" cy="24" r="12" fill="#9d74be" />
            <circle cx="0" cy="42" r="12" fill="#7c539b" />
            <circle cx="0" cy="30" r="10" fill="#8f63ac" />
            {/* snow cap */}
            <ellipse cx="0" cy="16" rx="21" ry="11" fill="#ffffff" />
            <ellipse cx="-11" cy="22" rx="8" ry="5" fill="#f2edfa" />
            <ellipse cx="11" cy="21" rx="7" ry="4.5" fill="#f7f3fc" />
          </g>
        </defs>

        {/* back layer: smaller, slightly muted */}
        <g opacity="0.82">
          <use href="#vm-bloom" transform="translate(28 92) scale(0.62)" />
          <use href="#vm-bloom" transform="translate(132 84) scale(0.7)" />
          <use href="#vm-bloom" transform="translate(238 96) scale(0.58)" />
          <use href="#vm-bloom" transform="translate(342 82) scale(0.72)" />
          <use href="#vm-bloom" transform="translate(452 94) scale(0.6)" />
          <use href="#vm-bloom" transform="translate(560 80) scale(0.7)" />
          <use href="#vm-bloom" transform="translate(668 95) scale(0.63)" />
          <use href="#vm-bloom" transform="translate(776 83) scale(0.71)" />
          <use href="#vm-bloom" transform="translate(884 93) scale(0.6)" />
          <use href="#vm-bloom" transform="translate(992 81) scale(0.72)" />
          <use href="#vm-bloom" transform="translate(1100 95) scale(0.61)" />
          <use href="#vm-bloom" transform="translate(1208 84) scale(0.7)" />
          <use href="#vm-bloom" transform="translate(1316 94) scale(0.62)" />
          <use href="#vm-bloom" transform="translate(1414 86) scale(0.68)" />
        </g>

        {/* front layer: larger, full color */}
        <g>
          <use href="#vm-bloom" transform="translate(-8 118) scale(0.95)" />
          <use href="#vm-bloom" transform="translate(84 126) scale(1.05)" />
          <use href="#vm-bloom" transform="translate(180 116) scale(0.9)" />
          <use href="#vm-bloom" transform="translate(272 128) scale(1.1)" />
          <use href="#vm-bloom" transform="translate(372 118) scale(0.96)" />
          <use href="#vm-bloom" transform="translate(466 128) scale(1.06)" />
          <use href="#vm-bloom" transform="translate(566 116) scale(0.92)" />
          <use href="#vm-bloom" transform="translate(658 128) scale(1.08)" />
          <use href="#vm-bloom" transform="translate(756 118) scale(0.95)" />
          <use href="#vm-bloom" transform="translate(850 128) scale(1.04)" />
          <use href="#vm-bloom" transform="translate(948 116) scale(0.9)" />
          <use href="#vm-bloom" transform="translate(1040 128) scale(1.1)" />
          <use href="#vm-bloom" transform="translate(1140 118) scale(0.94)" />
          <use href="#vm-bloom" transform="translate(1234 128) scale(1.06)" />
          <use href="#vm-bloom" transform="translate(1332 117) scale(0.92)" />
          <use href="#vm-bloom" transform="translate(1424 127) scale(1.05)" />
        </g>

        {/* ground */}
        <rect x="0" y="206" width="1440" height="24" fill="#4c7a3f" />
        <rect x="0" y="206" width="1440" height="6" fill="#568a47" />
      </svg>
    </div>
  );
}
