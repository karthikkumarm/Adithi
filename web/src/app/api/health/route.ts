import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'adithivault-web', time: new Date().toISOString() });
}

