"use client";

import { useState } from "react";
import PatientCharacter, {
  AvatarHairStyle,
  AvatarProfile,
  SelfieCapture,
} from "@/components/avatar/PatientCharacter";

function deriveAgeGroup(age: number): AvatarProfile["ageGroup"] {
  if (age >= 70) return "senior";
  if (age >= 40) return "middle";
  return "young";
}

export function buildDefaultAvatarProfile(
  age: number,
  sex: "M" | "F"
): AvatarProfile {
  return {
    sex,
    ageGroup: deriveAgeGroup(age),
    hairStyle: sex === "F" ? "long" : age >= 70 ? "bald" : "short",
    glasses: age >= 65,
  };
}

export default function AvatarOnboarding({
  patientName,
  age,
  sex,
  initialPhotoUrl,
  initialProfile,
  onComplete,
}: {
  patientName: string;
  age: number;
  sex: "M" | "F";
  initialPhotoUrl?: string | null;
  initialProfile?: AvatarProfile | null;
  onComplete: (payload: { photoUrl: string; profile: AvatarProfile }) => void;
}) {
  const defaultProfile = initialProfile ?? buildDefaultAvatarProfile(age, sex);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl ?? null);
  const [profile, setProfile] = useState<AvatarProfile>(defaultProfile);

  const hairOptions: { id: AvatarHairStyle; label: string }[] = [
    { id: "short", label: "짧은 머리" },
    { id: "medium", label: "중간 머리" },
    { id: "long", label: "긴 머리" },
    { id: "bald", label: "민머리" },
  ];

  return (
    <div className="animate-fade-in min-h-[70vh] flex items-center justify-center px-1">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h1 className="text-lg font-bold text-gray-900">첫 접속 설정</h1>
        <p className="text-xs text-gray-500 mt-1">
          {patientName}님 맞춤 아바타를 만들기 위해 셀카를 먼저 촬영해주세요.
        </p>

        <div className="mt-4 flex flex-col items-center">
          <PatientCharacter
            photoUrl={photoUrl}
            size={96}
            mood="neutral"
            profile={profile}
          />
        </div>

        <div className="mt-2">
          <SelfieCapture onCapture={(url) => setPhotoUrl(url)} />
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">헤어스타일</p>
          <div className="grid grid-cols-2 gap-2">
            {hairOptions.map((option) => {
              const selected = profile.hairStyle === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, hairStyle: option.id }))
                  }
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                    selected
                      ? "border-teal-400 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3">
          <button
            onClick={() =>
              setProfile((prev) => ({ ...prev, glasses: !prev.glasses }))
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              profile.glasses
                ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {profile.glasses ? "안경 착용" : "안경 미착용"}
          </button>
        </div>

        <button
          onClick={() => photoUrl && onComplete({ photoUrl, profile })}
          disabled={!photoUrl}
          className="mt-4 w-full rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2.5 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          SpineTrack 시작하기
        </button>
      </div>
    </div>
  );
}
