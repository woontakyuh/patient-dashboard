"use client";

interface SpineAvatarProps {
  surgeryLevel: string;
}

interface Vertebra {
  id: string;
  label: string;
  y: number;
}

const cervicalVertebrae: Vertebra[] = [
  { id: "C1", label: "경추 1번", y: 0 },
  { id: "C2", label: "경추 2번", y: 1 },
  { id: "C3", label: "경추 3번", y: 2 },
  { id: "C4", label: "경추 4번", y: 3 },
  { id: "C5", label: "경추 5번", y: 4 },
  { id: "C6", label: "경추 6번", y: 5 },
  { id: "C7", label: "경추 7번", y: 6 },
  { id: "T1", label: "흉추 1번", y: 7 },
];

const lumbarVertebrae: Vertebra[] = [
  { id: "T12", label: "흉추 12번", y: 0 },
  { id: "L1", label: "요추 1번", y: 1 },
  { id: "L2", label: "요추 2번", y: 2 },
  { id: "L3", label: "요추 3번", y: 3 },
  { id: "L4", label: "요추 4번", y: 4 },
  { id: "L5", label: "요추 5번", y: 5 },
  { id: "S1", label: "천추 1번", y: 6 },
];

function parseSurgeryLevel(level: string): { segments: { upper: string; lower: string }[]; region: "cervical" | "lumbar" } {
  const segments: { upper: string; lower: string }[] = [];
  // Match patterns like C5-6, L4-5, C3-6, T12
  const rangeMatch = level.match(/([CLST]\d{1,2})-(\d{1,2})/g);

  if (rangeMatch) {
    for (const m of rangeMatch) {
      const parts = m.match(/([CLST])(\d{1,2})-(\d{1,2})/);
      if (parts) {
        const prefix = parts[1];
        const upper = `${prefix}${parts[2]}`;
        const lower = `${prefix}${parts[3]}`;
        segments.push({ upper, lower });
      }
    }
  }

  // Single level like T12
  if (segments.length === 0) {
    const singleMatch = level.match(/([CLST]\d{1,2})/);
    if (singleMatch) {
      segments.push({ upper: singleMatch[1], lower: singleMatch[1] });
    }
  }

  const isCervical = level.startsWith("C");
  return { segments, region: isCervical ? "cervical" : "lumbar" };
}

export default function SpineAvatar({ surgeryLevel }: SpineAvatarProps) {
  const { segments, region } = parseSurgeryLevel(surgeryLevel);
  const vertebrae = region === "cervical" ? cervicalVertebrae : lumbarVertebrae;
  const title = region === "cervical" ? "경추 다이어그램" : "요추-천추 다이어그램";
  const spacing = 42;
  const startY = 52;
  const svgHeight = startY + vertebrae.length * spacing + 20;

  // Build sets of highlighted vertebrae and discs
  const highlightedVertebrae = new Set<string>();
  const highlightedDiscs = new Set<string>(); // use upper vertebra id as key

  for (const seg of segments) {
    highlightedVertebrae.add(seg.upper);
    highlightedVertebrae.add(seg.lower);

    // Highlight all discs between upper and lower
    const upperIdx = vertebrae.findIndex((v) => v.id === seg.upper);
    const lowerIdx = vertebrae.findIndex((v) => v.id === seg.lower);
    if (upperIdx >= 0 && lowerIdx >= 0) {
      for (let i = Math.min(upperIdx, lowerIdx); i < Math.max(upperIdx, lowerIdx); i++) {
        highlightedDiscs.add(vertebrae[i].id);
      }
      // For single vertebra, highlight the disc below
      if (upperIdx === lowerIdx && upperIdx < vertebrae.length - 1) {
        highlightedDiscs.add(vertebrae[upperIdx].id);
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 240 ${svgHeight}`}
      className="w-full h-auto max-w-[200px]"
      aria-label={`${title} - ${surgeryLevel} 수술 부위`}
    >
      {/* Title */}
      <text x={120} y={18} textAnchor="middle" fontSize={13} fontWeight={600} fill="#374151">
        {title}
      </text>

      {/* Spinal cord background */}
      <rect x={112} y={28} width={16} height={vertebrae.length * spacing + 10} rx={8} fill="#e0f2fe" opacity={0.5} />

      {vertebrae.map((v, i) => {
        const cx = 120;
        const cy = startY + i * spacing;
        const isHighlighted = highlightedVertebrae.has(v.id);
        const showDisc = i < vertebrae.length - 1;
        const isDiscHighlighted = highlightedDiscs.has(v.id);

        // Slightly smaller for cervical
        const bodyW = region === "cervical" ? 56 : 64;
        const bodyH = region === "cervical" ? 26 : 30;
        const procRx = region === "cervical" ? 11 : 14;
        const procRy = region === "cervical" ? 6 : 8;
        const procOffset = region === "cervical" ? 40 : 48;

        return (
          <g key={v.id}>
            {/* Transverse processes */}
            <ellipse
              cx={cx - procOffset}
              cy={cy}
              rx={procRx}
              ry={procRy}
              fill={isHighlighted ? "#dbeafe" : "#f1f5f9"}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={1}
            />
            <ellipse
              cx={cx + procOffset}
              cy={cy}
              rx={procRx}
              ry={procRy}
              fill={isHighlighted ? "#dbeafe" : "#f1f5f9"}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={1}
            />

            {/* Vertebral body */}
            <rect
              x={cx - bodyW / 2}
              y={cy - bodyH / 2}
              width={bodyW}
              height={bodyH}
              rx={8}
              fill={isHighlighted ? "#dbeafe" : "#f8fafc"}
              stroke={isHighlighted ? "#2563eb" : "#cbd5e1"}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
            />

            {/* Spinous process */}
            <rect
              x={cx - 5}
              y={cy - bodyH / 2 - 7}
              width={10}
              height={10}
              rx={3}
              fill={isHighlighted ? "#bfdbfe" : "#e2e8f0"}
              stroke={isHighlighted ? "#3b82f6" : "#cbd5e1"}
              strokeWidth={1}
            />

            {/* Label inside */}
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={isHighlighted ? 700 : 500}
              fill={isHighlighted ? "#1d4ed8" : "#64748b"}
            >
              {v.id}
            </text>

            {/* Korean label on the left */}
            <text
              x={28}
              y={cy + 4}
              textAnchor="middle"
              fontSize={9}
              fill={isHighlighted ? "#1d4ed8" : "#94a3b8"}
              fontWeight={isHighlighted ? 600 : 400}
            >
              {v.label}
            </text>

            {/* Disc */}
            {showDisc && (
              <g>
                {isDiscHighlighted && (
                  <ellipse cx={cx} cy={cy + bodyH / 2 + 5} rx={28} ry={6} fill="#fecaca" opacity={0.5}>
                    <animate attributeName="rx" values="26;30;26" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                )}
                <ellipse
                  cx={cx}
                  cy={cy + bodyH / 2 + 5}
                  rx={22}
                  ry={4}
                  fill={isDiscHighlighted ? "#ef4444" : "#d1d5db"}
                  opacity={isDiscHighlighted ? 0.85 : 0.4}
                />
              </g>
            )}

            {/* Surgery annotation - show only once for the first highlighted disc */}
            {isDiscHighlighted && !highlightedDiscs.has(vertebrae[i - 1]?.id) && (
              <g>
                <line x1={cx + 36} y1={cy + bodyH / 2 + 5} x2={cx + 58} y2={cy + bodyH / 2 + 5} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" />
                <rect x={cx + 58} y={cy + bodyH / 2 - 6} width={52} height={22} rx={6} fill="#fef2f2" stroke="#fca5a5" strokeWidth={1} />
                <text x={cx + 84} y={cy + bodyH / 2 + 9} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">
                  수술 부위
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
