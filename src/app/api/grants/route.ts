import { NextResponse } from 'next/server'
import { GRANTS } from '@/lib/grants-data'

export async function GET() {
  return NextResponse.json(GRANTS)
}
