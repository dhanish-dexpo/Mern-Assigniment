import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/hr/feedback/new");
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">HR Sign In</h1>
        <a
          href="/api/auth/signin"
          className="block rounded-md bg-black text-white py-2 text-center hover:bg-gray-800"
        >
          Continue with Google
        </a>
        <p className="text-center text-sm text-gray-500">
          Access is restricted to approved HR emails.
        </p>
        <p className="text-center text-sm">
          Or go back to <Link href="/">home</Link>
        </p>
      </div>
    </div>
  );
}
