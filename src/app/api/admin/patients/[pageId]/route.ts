import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPatientDetail } from "@/lib/notion/patients";

export async function GET(
  _request: Request,
  { params }: { params: { pageId: string } }
) {
  const auth = cookies().get("admin-auth");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const patient = await getPatientDetail(params.pageId);
    if (!patient) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
