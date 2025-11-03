import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import HRFeedbackForm from "../../../../components/HRFeedbackForm";
import { redirect } from "next/navigation";

function isHREmail(email?: string | null) {
  const list = (process.env.HR_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const e = (email || "").toLowerCase();
  return list.includes(e) || list.some((a) => a.startsWith("@") && e.endsWith(a));
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || !isHREmail(email)) {
    redirect("/hr/login");
  }
  return <HRFeedbackForm />;
}
