"use client";

export default function PatientNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">환자 정보를 찾을 수 없습니다</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        올바른 주소로 접속했는지 확인해 주세요.<br />
        문제가 지속되면 병원에 문의해 주세요.
      </p>
    </div>
  );
}
