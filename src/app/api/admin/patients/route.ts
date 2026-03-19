import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { searchPatients, getAllPatients } from "@/lib/notion/patients";

export async function GET(request: NextRequest) {
  const auth = cookies().get("admin-auth");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") || "";

  try {
    const patients = q ? await searchPatients(q) : await getAllPatients();
    return NextResponse.json({ patients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
