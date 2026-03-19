import React from 'react';

// Reference radii (km): Mercury 2439, Venus 6051, Earth 6371, Mars 3389,
// Ceres 473, Jupiter 71492, Saturn 60268, Uranus 25559, Neptune 24622,
// Pluto 1188, Haumea ~620, Makemake 715, Eris 1163
// Scale: Jupiter = 140px display

const SCALE = 140 / 71492; // px per km

function getPlanetStyle(planet, size) {
  const base = {
    width: size,
    height: size,
    borderRadius: '50%',
    position: 'relative',
    flexShrink: 0,
    overflow: 'hidden',
  };

  switch (planet.id) {
    case 'mercury':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #d4d4d4, #9e9e9e 50%, #707070)',
        boxShadow: `0 0 ${size * 0.15}px rgba(158,158,158,0.3)`,
      };

    case 'venus':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #fff0b0, #e8c97e 40%, #c8962e)',
        boxShadow: `0 0 ${size * 0.25}px rgba(232,201,126,0.5)`,
      };

    case 'earth':
      return {
        ...base,
        background: `
          radial-gradient(circle at 35% 35%, #88ccff, #4b9cd3 35%, #2a6ea6)
        `,
        boxShadow: `0 0 ${size * 0.3}px rgba(75,156,211,0.5)`,
      };

    case 'mars':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #e8805a, #cd4f2a 45%, #9a3010)',
        boxShadow: `0 0 ${size * 0.2}px rgba(205,79,42,0.4)`,
      };

    case 'ceres':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #d4c4b8, #9e8878 50%, #7a6458)',
        boxShadow: `0 0 ${size * 0.15}px rgba(184,169,154,0.3)`,
      };

    case 'jupiter':
      return {
        ...base,
        background: `
          repeating-linear-gradient(
            180deg,
            #e8c898 0px,       #c88b3a ${size * 0.08}px,
            #e8c898 ${size * 0.12}px, #d4a060 ${size * 0.2}px,
            #b87030 ${size * 0.28}px, #e8c898 ${size * 0.32}px,
            #d4a060 ${size * 0.4}px,  #c88b3a ${size * 0.5}px,
            #e0b870 ${size * 0.58}px, #c88b3a ${size * 0.68}px,
            #e8c898 ${size * 0.72}px, #d4a060 ${size * 0.8}px,
            #c88b3a ${size * 0.88}px, #e8c898 ${size}px
          )
        `,
        boxShadow: `0 0 ${size * 0.2}px rgba(200,139,58,0.4)`,
      };

    case 'saturn':
      // Saturn rendered without ring here; ring is added separately via wrapper
      return {
        ...base,
        background: `
          repeating-linear-gradient(
            180deg,
            #f0e0b0 0px,       #e8d5a3 ${size * 0.1}px,
            #d4c090 ${size * 0.2}px, #e8d5a3 ${size * 0.3}px,
            #c8aa70 ${size * 0.42}px, #e8d5a3 ${size * 0.5}px,
            #d4c090 ${size * 0.62}px, #e8d5a3 ${size * 0.72}px,
            #c8aa70 ${size * 0.85}px, #f0e0b0 ${size}px
          )
        `,
        boxShadow: `0 0 ${size * 0.25}px rgba(232,213,163,0.4)`,
      };

    case 'uranus':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #b0f4f4, #7de8e8 40%, #50c8c8)',
        boxShadow: `0 0 ${size * 0.25}px rgba(125,232,232,0.4)`,
      };

    case 'neptune':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #6888e8, #3f54ba 40%, #202878)',
        boxShadow: `0 0 ${size * 0.25}px rgba(63,84,186,0.5)`,
      };

    case 'pluto':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #e8d5b0, #c4a882 45%, #9a7a52)',
        boxShadow: `0 0 ${size * 0.15}px rgba(196,168,130,0.3)`,
      };

    case 'haumea':
      // Haumea is notably elongated — we render it as a squished ellipse
      return {
        ...base,
        width: Math.round(size * 1.6),
        height: size,
        background: 'radial-gradient(ellipse at 35% 35%, #ede0c8, #d4c5a9 50%, #a89878)',
        boxShadow: `0 0 ${size * 0.15}px rgba(212,197,169,0.3)`,
      };

    case 'makemake':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #e8a870, #d4864a 45%, #a05820)',
        boxShadow: `0 0 ${size * 0.15}px rgba(212,134,74,0.3)`,
      };

    case 'eris':
      return {
        ...base,
        background: 'radial-gradient(circle at 35% 35%, #e8e8e8, #c8c8c8 50%, #989898)',
        boxShadow: `0 0 ${size * 0.15}px rgba(200,200,200,0.3)`,
      };

    default:
      return {
        ...base,
        background: `radial-gradient(circle at 35% 35%, ${planet.colour}dd, ${planet.colour}, ${planet.colour}88)`,
      };
  }
}

export function PlanetVisual({ planet, size: sizeProp, style = {} }) {
  const size = sizeProp || Math.max(14, Math.round(planet.radius * SCALE));
  const planetStyle = getPlanetStyle(planet, size);
  const hasRedSpot = planet.id === 'jupiter';
  const hasSaturnRing = planet.id === 'saturn';
  const hasUranuRing = planet.id === 'uranus';
  // Haumea is wider than tall
  const displayW = planet.id === 'haumea' ? Math.round(size * 1.6) : size;

  const inner = (
    <div style={planetStyle}>
      {hasRedSpot && (
        <div style={{
          position: 'absolute',
          width: size * 0.25,
          height: size * 0.15,
          background: 'radial-gradient(ellipse, #cc4422 30%, #aa3311 70%)',
          borderRadius: '50%',
          top: '45%',
          left: '25%',
          opacity: 0.85,
        }} />
      )}
      {/* Sphere highlight */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
    </div>
  );

  // Saturn — draw ring behind and in front
  if (hasSaturnRing) {
    const ringW = size * 2.4;
    const ringH = size * 0.45;
    return (
      <div style={{ position: 'relative', width: ringW, height: size + ringH * 0.4, flexShrink: 0, ...style }}>
        {/* Ring behind planet (bottom half clipped by planet) */}
        <div style={{
          position: 'absolute',
          top: ringH * 0.35,
          left: 0,
          width: ringW,
          height: ringH,
          borderRadius: '50%',
          background: 'transparent',
          border: `${Math.max(2, size * 0.06)}px solid rgba(220,200,140,0.55)`,
          boxShadow: `0 0 ${size * 0.08}px rgba(220,200,140,0.3),
                      inset 0 0 ${size * 0.08}px rgba(160,130,70,0.4)`,
          zIndex: 0,
        }} />
        {/* Second ring band */}
        <div style={{
          position: 'absolute',
          top: ringH * 0.22,
          left: size * 0.1,
          width: ringW * 0.82,
          height: ringH * 0.7,
          borderRadius: '50%',
          background: 'transparent',
          border: `${Math.max(1, size * 0.035)}px solid rgba(200,180,110,0.35)`,
          zIndex: 0,
        }} />
        {/* Planet body */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: (ringW - size) / 2,
          zIndex: 1,
        }}>
          {inner}
        </div>
        {/* Ring in front (upper half only, to create wraparound) */}
        <div style={{
          position: 'absolute',
          top: ringH * 0.35,
          left: 0,
          width: ringW,
          height: ringH / 2,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          background: 'transparent',
          borderTop: `${Math.max(2, size * 0.06)}px solid rgba(220,200,140,0.55)`,
          borderLeft: `${Math.max(2, size * 0.06)}px solid rgba(220,200,140,0.55)`,
          borderRight: `${Math.max(2, size * 0.06)}px solid rgba(220,200,140,0.55)`,
          zIndex: 2,
        }} />
      </div>
    );
  }

  // Uranus — thin vertical rings (it's tilted)
  if (hasUranuRing) {
    const ringSize = size * 1.5;
    return (
      <div style={{ position: 'relative', width: ringSize, height: ringSize, flexShrink: 0, ...style }}>
        <div style={{
          position: 'absolute',
          top: (ringSize - size) / 2,
          left: (ringSize - size) / 2,
          zIndex: 1,
        }}>
          {inner}
        </div>
        {/* Thin rings — tilted so they look more vertical */}
        <div style={{
          position: 'absolute',
          top: 0, left: (ringSize - size * 0.18) / 2,
          width: size * 0.18,
          height: ringSize,
          borderRadius: '50%',
          background: 'transparent',
          border: `${Math.max(1, size * 0.025)}px solid rgba(125,232,232,0.35)`,
          zIndex: 0,
          pointerEvents: 'none',
        }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: displayW, height: size, flexShrink: 0, ...style }}>
      {inner}
    </div>
  );
}

export default PlanetVisual;
