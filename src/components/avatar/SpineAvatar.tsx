"use client";

interface SpineAvatarProps {
  surgeryLevel: string;
}

const vertebrae = [
  { id: "L1", label: "요추 1번", y: 0 },
  { id: "L2", label: "요추 2번", y: 1 },
  { id: "L3", label: "요추 3번", y: 2 },
  { id: "L4", label: "요추 4번", y: 3 },
  { id: "L5", label: "요추 5번", y: 4 },
  { id: "S1", label: "천추 1번", y: 5 },
];

function parseSurgeryLevel(level: string): { upper: string; lower: string } {
  const match = level.match(/([LS]\d)-(\d)/);
  if (match) {
    const prefix = match[1][0];
    return { upper: match[1], lower: `${prefix}${match[2]}` };
  }
  return { upper: "", lower: "" };
}

export default function SpineAvatar({ surgeryLevel }: SpineAvatarProps) {
  const { upper, lower } = parseSurgeryLevel(surgeryLevel);
  const discHighlightIndex = vertebrae.findIndex((v) => v.id === upper);

  return (
    <svg
      viewBox="0 0 240 340"
      className="w-full h-auto max-w-[200px]"
      aria-label={`요추 다이어그램 - ${surgeryLevel} 수술 부위`}
    >
      {/* Title */}
      <text x={120} y={18} textAnchor="middle" fontSize={13} fontWeight={600} fill="#374151">
        요추-천추 다이어그램
      </text>

      {/* Spinal cord background */}
      <rect x={112} y={28} width={16} height={280} rx={8} fill="#e0f2fe" opacity={0.5} />

      {vertebrae.map((v, i) => {
        const cx = 120;
        const cy = 52 + i * 50;
        const isUpper = v.id === upper;
        const isLower = v.id === lower;
        const isHighlighted = isUpper || isLower;
        const showDisc = i < vertebrae.length - 1;
        const isDiscHighlighted = i === discHighlightIndex;

        return (
          <g key={v.id}>
            {/* Transverse processes */}
            <ellipse
              cx={cx - 48}
              cy={cy}
              rx={14}
              ry={8}
              fill={isHighlighted ? "#dbeafe" : "#f1f5f9"}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={1}
            />
            <ellipse
              cx={cx + 48}
              cy={cy}
              rx={14}
              ry={8}
              fill={isHighlighted ? "#dbeafe" : "#f1f5f9"}
              stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
              strokeWidth={1}
            />

            {/* Vertebral body */}
            <rect
              x={cx - 32}
              y={cy - 15}
              width={64}
              height={30}
              rx={8}
              fill={isHighlighted ? "#dbeafe" : "#f8fafc"}
              stroke={isHighlighted ? "#2563eb" : "#cbd5e1"}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
            />

            {/* Spinous process */}
            <rect
              x={cx - 5}
              y={cy - 22}
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
              fontSize={13}
              fontWeight={isHighlighted ? 700 : 500}
              fill={isHighlighted ? "#1d4ed8" : "#64748b"}
            >
              {v.id}
            </text>

            {/* Korean label on the left */}
            <text
              x={30}
              y={cy + 4}
              textAnchor="middle"
              fontSize={10}
              fill={isHighlighted ? "#1d4ed8" : "#94a3b8"}
              fontWeight={isHighlighted ? 600 : 400}
            >
              {v.label}
            </text>

            {/* Disc */}
            {showDisc && (
              <g>
                {isDiscHighlighted && (
                  <ellipse cx={cx} cy={cy + 23} rx={28} ry={6} fill="#fecaca" opacity={0.5}>
                    <animate attributeName="rx" values="26;30;26" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                )}
                <ellipse
                  cx={cx}
                  cy={cy + 23}
                  rx={22}
                  ry={4}
                  fill={isDiscHighlighted ? "#ef4444" : "#d1d5db"}
                  opacity={isDiscHighlighted ? 0.85 : 0.4}
                />
              </g>
            )}

            {/* Surgery annotation */}
            {isDiscHighlighted && (
              <g>
                <line x1={cx + 40} y1={cy + 23} x2={cx + 64} y2={cy + 23} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" />
                <rect x={cx + 64} y={cy + 12} width={52} height={22} rx={6} fill="#fef2f2" stroke="#fca5a5" strokeWidth={1} />
                <text x={cx + 90} y={cy + 27} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">
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
