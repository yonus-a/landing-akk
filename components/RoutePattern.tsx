import React, { useId } from "react";

type Point = { x: number; y: number };

type RoutePatternProps = {
  hub: Point;
  origins: Point[];
  className?: string;
};

const VIEW_W = 1440;
const VIEW_H = 900;

function arcPath(from: Point, to: Point, bend: number) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * len * bend;
  const cy = my + (dx / len) * len * bend;
  return `M${from.x} ${from.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
}

export function RoutePattern({ hub, origins, className = "" }: RoutePatternProps) {
  const uid = useId().replace(/:/g, "");
  const routes = origins.map((o, i) => ({
    d: arcPath(o, hub, i % 2 === 0 ? 0.18 : -0.18),
    origin: o,
  }));

  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Dot grid, densest around the hub */}
      <div
        className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(185,203,255,0.6)_1px,transparent_1.3px)] [background-size:22px_22px]"
        style={{
          maskImage: `radial-gradient(ellipse 70% 70% at ${(hub.x / VIEW_W) * 100}% ${(hub.y / VIEW_H) * 100}%, black 20%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(ellipse 70% 70% at ${(hub.x / VIEW_W) * 100}% ${(hub.y / VIEW_H) * 100}%, black 20%, transparent 75%)`,
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id={`fade-${uid}`} cx={hub.x} cy={hub.y} r="900" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#b9cbff" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#6f95f0" stopOpacity="0.45" />
            <stop offset="1" stopColor="#2a5ae0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`hub-${uid}`}>
            <stop offset="0" stopColor="#8fb0ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#2a5ae0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint continuous route under the moving dashes */}
        <g stroke={`url(#fade-${uid})`} strokeWidth="1" opacity="0.35">
          {routes.map((r, i) => (
            <path key={`base-${i}`} d={r.d} />
          ))}
        </g>
        <g stroke={`url(#fade-${uid})`} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 9" opacity="0.7">
          {routes.map((r, i) => (
            <path key={`dash-${i}`} d={r.d} className="route-flow" style={{ animationDelay: `${i * -0.6}s` }} />
          ))}
        </g>

        {/* Cargo packets travelling toward the hub */}
        <g className="motion-reduce:hidden">
          {routes.map((r, i) => (
            <circle key={`pkt-${i}`} r="2.6" fill="#cfdcff" opacity="0.85">
              <animateMotion dur={`${7 + i * 1.3}s`} begin={`${i * -1.7}s`} repeatCount="indefinite" path={r.d} />
            </circle>
          ))}
        </g>

        {/* Origin nodes */}
        <g fill="#8fb0ff" opacity="0.5">
          {routes.map((r, i) => (
            <circle key={`org-${i}`} cx={r.origin.x} cy={r.origin.y} r="3" />
          ))}
        </g>

        {/* Hub */}
        <circle cx={hub.x} cy={hub.y} r="120" fill={`url(#hub-${uid})`} />
        <circle cx={hub.x} cy={hub.y} r="14" stroke="#8fb0ff" strokeWidth="1" opacity="0.5" className="route-pulse" />
        <circle cx={hub.x} cy={hub.y} r="14" stroke="#8fb0ff" strokeWidth="1" opacity="0.5" className="route-pulse" style={{ animationDelay: "-1.5s" }} />
        <circle cx={hub.x} cy={hub.y} r="24" stroke="#8fb0ff" strokeWidth="0.6" opacity="0.35" />
        <circle cx={hub.x} cy={hub.y} r="4.5" fill="#cfdcff" />
      </svg>
    </div>
  );
}

export default RoutePattern;
