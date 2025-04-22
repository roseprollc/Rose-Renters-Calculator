import { getSession } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  return NextResponse.json({ user: session?.user })
} 