import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { connectToDB } from "../../../lib/db";
import { Feedback } from "../../../models/Feedback";
import { Resend } from "resend";
import crypto from "crypto";

function isHREmail(email?: string | null) {
  const list = (process.env.HR_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const e = (email || "").toLowerCase();
  return list.includes(e) || list.some((a) => a.startsWith("@") && e.endsWith(a));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || !isHREmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { userName, userEmail, sessionAt, observations, recommendations, rating } = body;
  if (!userName || !userEmail || !sessionAt || !observations || !recommendations) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectToDB();
  const viewToken = crypto.randomBytes(24).toString("hex");
  const doc = await Feedback.create({
    userName,
    userEmail,
    sessionAt: new Date(sessionAt),
    observations,
    recommendations,
    rating,
    createdByEmail: email,
    viewToken,
  });

  // send email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    const link = `${baseUrl}/view/${doc.viewToken}`;
    const summary = (observations as string).slice(0, 200);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
      to: userEmail,
      subject: `Your session feedback` ,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Session Feedback</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for your session. Here's a quick summary:</p>
          <blockquote>${summary}${(observations as string).length > 200 ? "..." : ""}</blockquote>
          <p>View full feedback securely here:</p>
          <p><a href="${link}">${link}</a></p>
          <hr />
          <p style="font-size:12px;color:#666">If you didn't expect this, you can ignore this email.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Email send failed", e);
    // proceed without failing the request
  }

  return NextResponse.json({ id: doc._id, viewToken: doc.viewToken });
}
