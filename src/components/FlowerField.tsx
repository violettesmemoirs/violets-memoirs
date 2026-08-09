import { useId } from 'react';

/**
 * Violette's signature snow-capped violet field, drawn as inline SVG so it
 * loads instantly and scales to any width. Layered pine-tree silhouettes,
 * a soft dusk wash, a scatter of drifting snow, and a couple of deeper
 * indigo blooms give it more depth and a nostalgic snowy-woods feel.
 *
 * `variant="garland"` renders a much thinner, quieter strip of blooms with
 * no ground or trees, meant to sit above content rather than under it.
 * Every `<defs>` id is namespaced with useId() so multiple instances can
 * sit on the same page without id collisions.
 */
export default function FlowerField({
  hem = false,
  variant = 'field',
}: {
  hem?: boolean;
  variant?: 'field' | 'garland';
}) {
  const uid = useId().replace(/[:]/g, '');
  const bloom = `vm-bloom-${uid}`;
  const bloomDeep = `vm-bloom-deep-${uid}`;
  const pine = `vm-pine-${uid}`;
  const dusk = `vm-dusk-${uid}`;

  if (variant === 'garland') {
    return (
      <div className="flower-field flower-field--garland" aria-hidden="true">
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
          focusable="false"
        >
          <defs>
            <g id={bloom}>
              <path
                d="M0 30 C -2 22 1 14 0 8"
                stroke="#4c7a3f"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="-9" cy="9" r="7" fill="#8f63ac" />
              <circle cx="9" cy="9" r="7" fill="#8f63ac" />
              <circle cx="-5" cy="3" r="7" fill="#9d74be" />
              <circle cx="5" cy="3" r="7" fill="#9d74be" />
              <circle cx="0" cy="11" r="7" fill="#7c539b" />
              <ellipse cx="0" cy="1" rx="12" ry="6" fill="#ffffff" />
              <ellipse cx="-6" cy="5" rx="5" ry="3" fill="#f2edfa" />
            </g>
          </defs>
          <g opacity="0.92">
            <use href={`#${bloom}`} transform="translate(18 46) scale(0.55)" />
            <use href={`#${bloom}`} transform="translate(96 40) scale(0.65)" />
            <use href={`#${bloom}`} transform="translate(180 48) scale(0.5)" />
            <use href={`#${bloom}`} transform="translate(268 38) scale(0.68)" />
            <use href={`#${bloom}`} transform="translate(356 47) scale(0.56)" />
            <use href={`#${bloom}`} transform="translate(444 39) scale(0.64)" />
            <use href={`#${bloom}`} transform="translate(532 48) scale(0.52)" />
            <use href={`#${bloom}`} transform="translate(620 40) scale(0.66)" />
            <use href={`#${bloom}`} transform="translate(712 47) scale(0.56)" />
            <use href={`#${bloom}`} transform="translate(800 39) scale(0.65)" />
            <use href={`#${bloom}`} transform="translate(888 48) scale(0.5)" />
            <use href={`#${bloom}`} transform="translate(976 38) scale(0.68)" />
            <use href={`#${bloom}`} transform="translate(1064 47) scale(0.56)" />
            <use href={`#${bloom}`} transform="translate(1152 39) scale(0.64)" />
            <use href={`#${bloom}`} transform="translate(1240 48) scale(0.53)" />
            <use href={`#${bloom}`} transform="translate(1328 40) scale(0.65)" />
            <use href={`#${bloom}`} transform="translate(1416 47) scale(0.55)" />
          </g>
          <g fill="#ffffff">
            <circle cx="58" cy="14" r="1.6" opacity="0.6" />
            <circle cx="240" cy="8" r="1.3" opacity="0.5" />
            <circle cx="410" cy="16" r="1.7" opacity="0.55" />
            <circle cx="590" cy="9" r="1.3" opacity="0.5" />
            <circle cx="770" cy="15" r="1.6" opacity="0.55" />
            <circle cx="950" cy="8" r="1.3" opacity="0.5" />
            <circle cx="1130" cy="16" r="1.7" opacity="0.55" />
            <circle cx="1310" cy="9" r="1.4" opacity="0.5" />
          </g>
        </svg>
      </div>
    );
  }

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
          <linearGradient id={dusk} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3768" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#4a3768" stopOpacity="0" />
          </linearGradient>

          <g id={pine}>
            <polygon points="-24,-8 24,-8 0,-34" fill="#33453b" />
            <polygon points="-18,-26 18,-26 0,-50" fill="#33453b" />
            <polygon points="-12,-44 12,-44 0,-64" fill="#33453b" />
            <rect x="-2.5" y="-8" width="5" height="9" fill="#2a3830" />
            <ellipse cx="0" cy="-33" rx="13" ry="3" fill="#f5f2fa" opacity="0.85" />
            <ellipse cx="0" cy="-49" rx="9" ry="2.4" fill="#f7f4fc" opacity="0.85" />
            <ellipse cx="0" cy="-63" rx="5.5" ry="2" fill="#ffffff" opacity="0.9" />
          </g>

          <g id={bloom}>
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

          <g id={bloomDeep}>
            {/* same silhouette, a cooler indigo cluster for variety/depth */}
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
            <circle cx="-16" cy="38" r="12" fill="#5b4088" />
            <circle cx="16" cy="38" r="12" fill="#5b4088" />
            <circle cx="-9" cy="24" r="12" fill="#6f57a0" />
            <circle cx="9" cy="24" r="12" fill="#6f57a0" />
            <circle cx="0" cy="42" r="12" fill="#493070" />
            <circle cx="0" cy="30" r="10" fill="#5b4088" />
            <ellipse cx="0" cy="16" rx="21" ry="11" fill="#f4f1fb" />
            <ellipse cx="-11" cy="22" rx="8" ry="5" fill="#e9e4f6" />
            <ellipse cx="11" cy="21" rx="7" ry="4.5" fill="#eee9f9" />
          </g>
        </defs>

        {/* dusk wash for depth and color, sits behind everything */}
        <rect x="0" y="0" width="1440" height="230" fill={`url(#${dusk})`} />

        {/* far layer: snow-capped pines, muted and behind the blooms */}
        <g opacity="0.6">
          <use href={`#${pine}`} transform="translate(48 205) scale(0.62)" />
          <use href={`#${pine}`} transform="translate(196 205) scale(0.82)" />
          <use href={`#${pine}`} transform="translate(344 205) scale(0.68)" />
          <use href={`#${pine}`} transform="translate(492 205) scale(0.9)" />
          <use href={`#${pine}`} transform="translate(640 205) scale(0.6)" />
          <use href={`#${pine}`} transform="translate(788 205) scale(0.84)" />
          <use href={`#${pine}`} transform="translate(936 205) scale(0.7)" />
          <use href={`#${pine}`} transform="translate(1084 205) scale(0.88)" />
          <use href={`#${pine}`} transform="translate(1232 205) scale(0.63)" />
          <use href={`#${pine}`} transform="translate(1380 205) scale(0.8)" />
        </g>

        {/* back layer: smaller, slightly muted blooms */}
        <g opacity="0.82">
          <use href={`#${bloom}`} transform="translate(28 92) scale(0.62)" />
          <use href={`#${bloom}`} transform="translate(132 84) scale(0.7)" />
          <use href={`#${bloomDeep}`} transform="translate(238 96) scale(0.58)" />
          <use href={`#${bloom}`} transform="translate(342 82) scale(0.72)" />
          <use href={`#${bloom}`} transform="translate(452 94) scale(0.6)" />
          <use href={`#${bloomDeep}`} transform="translate(560 80) scale(0.7)" />
          <use href={`#${bloom}`} transform="translate(668 95) scale(0.63)" />
          <use href={`#${bloom}`} transform="translate(776 83) scale(0.71)" />
          <use href={`#${bloomDeep}`} transform="translate(884 93) scale(0.6)" />
          <use href={`#${bloom}`} transform="translate(992 81) scale(0.72)" />
          <use href={`#${bloom}`} transform="translate(1100 95) scale(0.61)" />
          <use href={`#${bloomDeep}`} transform="translate(1208 84) scale(0.7)" />
          <use href={`#${bloom}`} transform="translate(1316 94) scale(0.62)" />
          <use href={`#${bloom}`} transform="translate(1414 86) scale(0.68)" />
        </g>

        {/* front layer: larger, full color, a few deep-indigo for variety */}
        <g>
          <use href={`#${bloom}`} transform="translate(-8 118) scale(0.95)" />
          <use href={`#${bloom}`} transform="translate(84 126) scale(1.05)" />
          <use href={`#${bloomDeep}`} transform="translate(180 116) scale(0.9)" />
          <use href={`#${bloom}`} transform="translate(272 128) scale(1.1)" />
          <use href={`#${bloom}`} transform="translate(372 118) scale(0.96)" />
          <use href={`#${bloomDeep}`} transform="translate(466 128) scale(1.06)" />
          <use href={`#${bloom}`} transform="translate(566 116) scale(0.92)" />
          <use href={`#${bloom}`} transform="translate(658 128) scale(1.08)" />
          <use href={`#${bloomDeep}`} transform="translate(756 118) scale(0.95)" />
          <use href={`#${bloom}`} transform="translate(850 128) scale(1.04)" />
          <use href={`#${bloom}`} transform="translate(948 116) scale(0.9)" />
          <use href={`#${bloomDeep}`} transform="translate(1040 128) scale(1.1)" />
          <use href={`#${bloom}`} transform="translate(1140 118) scale(0.94)" />
          <use href={`#${bloom}`} transform="translate(1234 128) scale(1.06)" />
          <use href={`#${bloomDeep}`} transform="translate(1332 117) scale(0.92)" />
          <use href={`#${bloom}`} transform="translate(1424 127) scale(1.05)" />
        </g>

        {/* ground */}
        <rect x="0" y="206" width="1440" height="24" fill="#4c7a3f" />
        <rect x="0" y="206" width="1440" height="6" fill="#568a47" />

        {/* a light dusting of drifting snow over the whole scene */}
        <g fill="#ffffff">
          <circle cx="36" cy="30" r="2" opacity="0.55" />
          <circle cx="132" cy="18" r="1.5" opacity="0.45" />
          <circle cx="238" cy="46" r="2.2" opacity="0.6" />
          <circle cx="340" cy="12" r="1.6" opacity="0.5" />
          <circle cx="452" cy="34" r="1.8" opacity="0.5" />
          <circle cx="560" cy="20" r="2" opacity="0.55" />
          <circle cx="668" cy="44" r="1.6" opacity="0.45" />
          <circle cx="776" cy="14" r="2.1" opacity="0.55" />
          <circle cx="884" cy="38" r="1.7" opacity="0.5" />
          <circle cx="992" cy="22" r="1.9" opacity="0.5" />
          <circle cx="1100" cy="42" r="1.5" opacity="0.45" />
          <circle cx="1208" cy="16" r="2.1" opacity="0.55" />
          <circle cx="1316" cy="36" r="1.7" opacity="0.5" />
          <circle cx="1414" cy="20" r="2" opacity="0.55" />
        </g>
      </svg>
    </div>
  );
}
