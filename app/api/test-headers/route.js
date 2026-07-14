import { NextResponse } from "next/server";

export async function GET(request) {
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return NextResponse.json({
    headers,
    ip: request.ip || "",
  });
}
