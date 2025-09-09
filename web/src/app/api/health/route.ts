import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'adithi-web', time: new Date().toISOString() });
}

