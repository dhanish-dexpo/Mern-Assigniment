import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import { Feedback, type IFeedback } from "../../../../../models/Feedback";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });
  await connectToDB();
  const doc = await Feedback.findOne({ viewToken: token }).lean<IFeedback>();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = doc as IFeedback;
  return NextResponse.json({
    userName: data.userName,
    userEmail: data.userEmail,
    sessionAt: data.sessionAt,
    observations: data.observations,
    recommendations: data.recommendations,
    rating: data.rating ?? null,
    createdAt: data.createdAt,
  });
}
