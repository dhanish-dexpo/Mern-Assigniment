import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import { Feedback } from "../../../../../models/Feedback";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });
  await connectToDB();
  const doc = await Feedback.findOne({ viewToken: token }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    userName: doc.userName,
    userEmail: doc.userEmail,
    sessionAt: doc.sessionAt,
    observations: doc.observations,
    recommendations: doc.recommendations,
    rating: doc.rating ?? null,
    createdAt: doc.createdAt,
  });
}
