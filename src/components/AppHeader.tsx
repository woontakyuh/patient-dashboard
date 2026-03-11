"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function getPatientHomePath(pathname: string): string {
  const patientPath = pathname.match(/^\/patient\/([^/]+)/);
  if (patientPath?.[1]) return `/${patientPath[1]}`;

  const rootPath = pathname.match(/^\/([^/]+)/);
  const firstSegment = rootPath?.[1];
  if (!firstSegment) return "/";
  if (["patient", "qr", "_next"].includes(firstSegment)) return "/";

  return `/${firstSegment}`;
}

export default function AppHeader() {
  const pathname = usePathname();
  const homePath = getPatientHomePath(pathname);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={homePath} className="text-base font-bold text-navy-500 tracking-tight">
          SpineTrack
        </Link>
      </div>
    </header>
  );
}
