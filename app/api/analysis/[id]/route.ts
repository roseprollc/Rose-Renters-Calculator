import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/app/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch analysis document
    const analysis = await prisma.analysis.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error fetching analysis:", error)
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    )
  }
} 