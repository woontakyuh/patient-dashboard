import PatientTable from "./components/PatientTable";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">환자 관리</h1>
        <p className="mt-1 text-sm text-zinc-400">
          등록된 환자 목록과 PROM 응답 현황
        </p>
      </div>
      <div className="mt-6">
        <PatientTable />
      </div>
    </div>
  );
}
