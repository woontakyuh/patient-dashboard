import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPatientIds, getPatientById } from "@/data/mock-patient";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_PATIENT_BASE_URL) {
    return process.env.NEXT_PUBLIC_PATIENT_BASE_URL;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }
  return "https://takmd.com";
}

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function PatientQrPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = getPatientById(params.id);
  if (!patient) {
    notFound();
  }

  const patientUrl = `${getBaseUrl()}/patient/${patient.id}`;
  const qrUrl = `https://quickchart.io/qr?size=360&margin=2&text=${encodeURIComponent(
    patientUrl,
  )}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">SpineTrack 접속 QR</h1>
        <p className="mt-1 text-sm text-slate-500">환자명: {patient.name}</p>
        <p className="text-xs text-slate-400">환자 ID: {patient.id}</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt={`${patient.name} 접속 QR`} className="mx-auto h-72 w-72" />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          QR 스캔 후 이름을 확인하고 주민등록번호 앞 6자리(YYMMDD)를 입력하면 자동으로 접속됩니다.
        </p>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">접속 링크</p>
          <p className="mt-1 break-all text-sm text-slate-700">{patientUrl}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/patient/${patient.id}`}
            className="flex-1 rounded-lg bg-teal-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-600"
          >
            환자 화면 미리보기
          </Link>
        </div>
      </div>
    </main>
  );
}
