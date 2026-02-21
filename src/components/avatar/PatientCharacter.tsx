"use client";

import { useRef, useState, useId } from "react";

interface PatientCharacterProps {
  photoUrl?: string | null;
  size?: number;
  mood?: "happy" | "neutral" | "recovering" | "hospital";
  showBrace?: boolean;
}

export default function PatientCharacter({
  photoUrl,
  size = 120,
  mood = "neutral",
  showBrace = false,
}: PatientCharacterProps) {
  const clipId = useId();

  const mouthPaths: Record<string, string> = {
    happy: "M 50 78 Q 60 88 70 78",
    neutral: "M 50 80 L 70 80",
    recovering: "M 50 82 Q 60 78 70 82",
    hospital: "M 52 80 Q 60 84 68 80",
  };

  const eyeY = mood === "hospital" ? 58 : 56;

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 120 156"
      className="flex-shrink-0"
    >
      {/* Body (gown) */}
      <ellipse cx={60} cy={130} rx={30} ry={22} fill="#e0f2fe" stroke="#93c5fd" strokeWidth={1.5} />

      {/* Arms */}
      <ellipse cx={28} cy={122} rx={8} ry={12} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
      <ellipse cx={92} cy={122} rx={8} ry={12} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />

      {/* Brace indicator */}
      {showBrace && (
        <rect x={42} y={115} width={36} height={8} rx={3} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1} opacity={0.8} />
      )}

      {/* Head (large, chibi ratio) */}
      <circle cx={60} cy={48} r={38} fill="#fef3c7" stroke="#fbbf24" strokeWidth={1.5} />

      {/* Photo face overlay (circular cropped) */}
      {photoUrl && (
        <>
          <defs>
            <clipPath id={clipId}>
              <circle cx={60} cy={48} r={28} />
            </clipPath>
          </defs>
          <image
            href={photoUrl}
            x={32}
            y={20}
            width={56}
            height={56}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
          {/* Soft edge ring around photo */}
          <circle cx={60} cy={48} r={28} fill="none" stroke="#fef3c7" strokeWidth={2} />
        </>
      )}

      {/* Hair (drawn on top of photo to frame it) */}
      <path
        d="M 22 40 Q 22 12 60 10 Q 98 12 98 40 Q 95 28 60 24 Q 25 28 22 40Z"
        fill="#374151"
      />

      {/* Face features (shown only without photo) */}
      {!photoUrl && (
        <>
          {/* Eyes */}
          <ellipse cx={46} cy={eyeY} rx={4} ry={4.5} fill="#1e293b" />
          <ellipse cx={74} cy={eyeY} rx={4} ry={4.5} fill="#1e293b" />
          <circle cx={44} cy={eyeY - 1.5} r={1.5} fill="white" />
          <circle cx={72} cy={eyeY - 1.5} r={1.5} fill="white" />

          {/* Blush */}
          <ellipse cx={38} cy={68} rx={6} ry={3} fill="#fecaca" opacity={0.5} />
          <ellipse cx={82} cy={68} rx={6} ry={3} fill="#fecaca" opacity={0.5} />

          {/* Mouth */}
          <path d={mouthPaths[mood]} fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {/* Hospital band on wrist */}
      {mood === "hospital" && (
        <rect x={24} y={126} width={10} height={3} rx={1} fill="white" stroke="#60a5fa" strokeWidth={0.5} />
      )}

      {/* Legs */}
      <rect x={46} y={148} width={10} height={6} rx={3} fill="#fde68a" />
      <rect x={64} y={148} width={10} height={6} rx={3} fill="#fde68a" />
    </svg>
  );
}

/**
 * Crops an image to a centered circle (face area) using Canvas.
 * Returns a square PNG dataURL with transparent corners.
 */
function cropFaceCircle(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const outputSize = 256;
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d")!;

      // Center-crop the source image to a square
      const srcSize = Math.min(img.width, img.height);
      const sx = (img.width - srcSize) / 2;
      // Bias upward slightly (face is usually in top 40% of photo)
      const sy = Math.max(0, (img.height - srcSize) / 2 - srcSize * 0.1);

      // Draw circular clip
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw the image centered in the circle
      ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, outputSize, outputSize);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(imageSrc); // Fallback to original
    img.src = imageSrc;
  });
}

// Selfie capture component with circular face cropping
export function SelfieCapture({
  onCapture,
}: {
  onCapture: (dataUrl: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawDataUrl = reader.result as string;

      // Crop face to circle
      const croppedUrl = await cropFaceCircle(rawDataUrl);

      setPreview(croppedUrl);
      onCapture(croppedUrl);
      localStorage.setItem("patient-avatar", croppedUrl);
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      {preview && (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="내 사진" className="w-full h-full object-cover" />
        </div>
      )}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={processing}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
      >
        {processing ? (
          "처리 중..."
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {preview ? "사진 변경" : "내 얼굴 촬영하기"}
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
