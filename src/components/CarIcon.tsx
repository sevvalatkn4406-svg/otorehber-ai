import React from "react";

export type CarBodyType =
  | "sedan"
  | "hatchback"
  | "suv"
  | "elektrikli"
  | "station-wagon"
  | "pickup";

interface CarIconProps {
  kasaTipi: CarBodyType;
  accentColor?: string;
  className?: string;
  ariaLabel?: string;
}

export function CarIcon({
  kasaTipi,
  accentColor = "var(--primary)",
  className = "w-full h-auto",
  ariaLabel,
}: CarIconProps) {
  const label =
    ariaLabel ||
    `${
      kasaTipi === "elektrikli"
        ? "Elektrikli"
        : kasaTipi === "station-wagon"
        ? "Station Wagon"
        : kasaTipi.toUpperCase()
    } araç silüeti`;

  // Base SVG viewBox 0 0 320 140
  const renderSilhouettes = () => {
    switch (kasaTipi) {
      case "sedan":
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx="160" cy="126" rx="140" ry="6" fill="currentColor" fillOpacity="0.1" />
            {/* Main Body */}
            <path
              d="M20 102 C25 95 45 92 65 92 L85 92 L120 54 C132 42 150 40 185 40 L220 40 C238 40 252 50 262 65 L292 82 C305 87 310 95 308 102 C306 106 295 108 275 108 L240 108 C238 92 222 80 205 80 C188 80 172 92 170 108 L110 108 C108 92 92 80 75 80 C58 80 42 92 40 108 L25 108 C20 108 18 105 20 102 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Windows */}
            <path
              d="M125 56 L160 56 L160 84 L96 84 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M168 56 L216 56 C228 56 238 64 246 76 L254 84 L168 84 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Accent Headlight & Taillight */}
            <path d="M296 84 L306 90 L292 94 Z" fill={accentColor} />
            <path d="M22 96 L28 96 L26 102 L20 102 Z" fill="#ef4444" />
            {/* Accent styling line */}
            <path d="M60 88 Q160 84 270 82" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            {/* Wheels */}
            <g transform="translate(75, 108)">
              <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="0" r="11" fill="#334155" />
              <circle cx="0" cy="0" r="5" fill={accentColor} />
            </g>
            <g transform="translate(205, 108)">
              <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="0" r="11" fill="#334155" />
              <circle cx="0" cy="0" r="5" fill={accentColor} />
            </g>
          </>
        );

      case "hatchback":
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx="160" cy="126" rx="135" ry="6" fill="currentColor" fillOpacity="0.1" />
            {/* Main Body */}
            <path
              d="M30 102 C32 94 40 85 48 72 C55 60 62 50 78 48 L170 48 C195 48 215 58 228 72 L268 86 C282 90 286 98 284 104 C282 108 270 108 250 108 L225 108 C222 92 208 80 190 80 C172 80 158 92 155 108 L115 108 C112 92 98 80 80 80 C62 80 48 92 45 108 L32 108 C29 108 28 105 30 102 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Rear spoiler */}
            <path d="M42 50 L68 47 L65 52 Z" fill={accentColor} />
            {/* Windows */}
            <path
              d="M72 54 L130 54 L130 82 L60 82 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M138 54 L175 54 C190 54 204 62 214 74 L224 82 L138 82 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Accent Headlight & Taillight */}
            <path d="M272 88 L282 94 L268 98 Z" fill={accentColor} />
            <path d="M36 78 L42 80 L38 90 L32 88 Z" fill="#ef4444" />
            {/* Accent dynamic character line */}
            <path d="M55 86 C110 84 180 82 245 84" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            {/* Wheels */}
            <g transform="translate(80, 108)">
              <circle cx="0" cy="0" r="17" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="0" r="10" fill="#334155" />
              <circle cx="0" cy="0" r="4" fill={accentColor} />
            </g>
            <g transform="translate(190, 108)">
              <circle cx="0" cy="0" r="17" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="0" r="10" fill="#334155" />
              <circle cx="0" cy="0" r="4" fill={accentColor} />
            </g>
          </>
        );

      case "suv":
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx="160" cy="128" rx="145" ry="6" fill="currentColor" fillOpacity="0.1" />
            {/* Roof rail */}
            <path d="M85 32 L205 32" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M95 32 L95 36 M195 32 L195 36" stroke="currentColor" strokeWidth="2" />
            {/* SUV Body - higher clearance */}
            <path
              d="M25 98 C26 85 36 70 55 58 C68 46 85 38 105 38 L200 38 C222 38 238 50 250 68 L285 82 C298 87 302 96 300 102 C298 106 288 106 270 106 L248 106 C244 88 226 74 205 74 C184 74 166 88 162 106 L112 106 C108 88 90 74 69 74 C48 74 30 88 26 106 L18 106 C16 106 15 102 18 98 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Windows */}
            <path
              d="M70 46 L130 46 L130 74 L55 74 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M138 46 L195 46 C210 46 225 54 235 66 L242 74 L138 74 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Protective lower body cladding */}
            <path d="M112 104 L162 104" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Accent Headlight & Taillight */}
            <path d="M288 84 L298 90 L285 94 Z" fill={accentColor} />
            <path d="M24 72 L32 72 L30 84 L22 84 Z" fill="#ef4444" />
            {/* Rugged Wheels */}
            <g transform="translate(69, 106)">
              <circle cx="0" cy="0" r="21" fill="#1e293b" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="13" fill="#334155" />
              <circle cx="0" cy="0" r="6" fill={accentColor} />
            </g>
            <g transform="translate(205, 106)">
              <circle cx="0" cy="0" r="21" fill="#1e293b" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="13" fill="#334155" />
              <circle cx="0" cy="0" r="6" fill={accentColor} />
            </g>
          </>
        );

      case "elektrikli":
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx="160" cy="126" rx="142" ry="6" fill="currentColor" fillOpacity="0.1" />
            {/* Futuristic Aero Body */}
            <path
              d="M24 100 C28 88 45 78 70 70 C95 50 135 34 185 34 C225 34 250 48 270 65 L296 82 C308 88 312 96 308 102 C304 106 290 106 270 106 L242 106 C238 90 222 78 202 78 C182 78 166 90 162 106 L110 106 C106 90 90 78 70 78 C50 78 34 90 30 106 L20 106 C16 106 18 103 24 100 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Panoramic Glass Roof */}
            <path
              d="M92 48 C120 40 160 38 190 40 C215 42 235 52 250 68 L260 76 L82 76 Z"
              fill="currentColor"
              fillOpacity="0.35"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Full-width LED light bar front */}
            <path d="M290 84 L308 90 L288 92 Z" fill={accentColor} />
            {/* Rear Cyber Light Bar */}
            <path d="M22 84 L38 82 L34 92 L20 92 Z" fill="#ef4444" />
            {/* EV Power / Lightning accent stripe */}
            <path
              d="M50 86 L140 84 L152 78 L144 86 L250 84"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Aero Blade Wheels */}
            <g transform="translate(70, 106)">
              <circle cx="0" cy="0" r="19" fill="#0f172a" stroke={accentColor} strokeWidth="2" />
              <polygon points="-8,-8 8,-4 6,8 -8,6" fill="currentColor" fillOpacity="0.5" />
              <circle cx="0" cy="0" r="5" fill={accentColor} />
            </g>
            <g transform="translate(202, 106)">
              <circle cx="0" cy="0" r="19" fill="#0f172a" stroke={accentColor} strokeWidth="2" />
              <polygon points="-8,-8 8,-4 6,8 -8,6" fill="currentColor" fillOpacity="0.5" />
              <circle cx="0" cy="0" r="5" fill={accentColor} />
            </g>
          </>
        );

      case "station-wagon":
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx="160" cy="126" rx="146" ry="6" fill="currentColor" fillOpacity="0.1" />
            {/* Roof rails */}
            <path d="M80 38 L220 38" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Long Estate Body */}
            <path
              d="M18 100 C20 85 28 65 48 52 C65 44 95 42 120 42 L225 42 C245 42 260 52 270 66 L295 82 C306 88 310 96 306 102 C304 106 290 106 270 106 L244 106 C240 90 224 78 205 78 C186 78 170 90 166 106 L110 106 C106 90 90 78 71 78 C52 78 36 90 32 106 L15 106 C12 106 14 103 18 100 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Extended 3-section side glass */}
            <path
              d="M48 56 L100 56 L100 78 L44 78 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M106 56 L175 56 L175 78 L106 78 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M181 56 L220 56 C232 56 244 64 252 74 L258 78 L181 78 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Accent Headlight & Taillight */}
            <path d="M298 84 L308 90 L292 94 Z" fill={accentColor} />
            <path d="M20 70 L28 72 L26 88 L18 86 Z" fill="#ef4444" />
            {/* Wheels */}
            <g transform="translate(71, 106)">
              <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="0" r="11" fill="#334155" />
              <circle cx="0" cy="0" r="5" fill={accentColor} />
            </g>
            <g transform="translate(205, 106)">
              <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="0" r="11" fill="#334155" />
              <circle cx="0" cy="0" r="5" fill={accentColor} />
            </g>
          </>
        );

      case "pickup":
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx="160" cy="128" rx="148" ry="6" fill="currentColor" fillOpacity="0.1" />
            {/* Heavy-duty Body with open rear bed */}
            <path
              d="M20 98 L20 74 L105 74 L108 52 C114 44 125 40 145 40 L205 40 C220 40 232 50 240 64 L265 72 L295 78 C306 82 312 90 310 98 C308 104 295 104 275 104 L255 104 C250 86 230 72 208 72 C186 72 168 86 162 104 L114 104 C108 86 88 72 66 72 C44 72 26 86 22 104 L12 104 C10 104 12 101 20 98 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Roll bar / Bed partition */}
            <path d="M100 74 L100 48 L114 48" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Cabin Windows */}
            <path
              d="M120 46 L160 46 L160 70 L115 70 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M166 46 L200 46 C212 46 222 54 228 64 L232 70 L166 70 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Front & Rear Lights */}
            <path d="M298 78 L310 84 L294 88 Z" fill={accentColor} />
            <path d="M16 78 L22 78 L20 90 L14 90 Z" fill="#ef4444" />
            {/* Rugged Offroad Wheels */}
            <g transform="translate(66, 104)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
              <circle cx="0" cy="0" r="14" fill="#334155" />
              <circle cx="0" cy="0" r="6" fill={accentColor} />
            </g>
            <g transform="translate(208, 104)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
              <circle cx="0" cy="0" r="14" fill="#334155" />
              <circle cx="0" cy="0" r="6" fill={accentColor} />
            </g>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 330 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderSilhouettes()}
    </svg>
  );
}
