import { NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    // Check if user is authenticated
    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid analysis ID" }),
        { status: 400 }
      )
    }

    // Fetch analysis document
    const analysis = await db
      .collection("analyses")
      .findOne({
        _id: new ObjectId(params.id),
        userId: session.user.sub // Ensure user can only access their own analyses
      })

    if (!analysis) {
      return new NextResponse(
        JSON.stringify({ error: "Analysis not found" }),
        { status: 404 }
      )
    }

    // Convert MongoDB _id to string ID
    const { _id, ...analysisData } = analysis
    
    return NextResponse.json({
      id: _id.toString(),
      ...analysisData
    })
  } catch (error) {
    console.error("Error fetching analysis:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch analysis" }),
      { status: 500 }
    )
  }
} 