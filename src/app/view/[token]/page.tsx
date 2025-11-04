import { connectToDB } from "../../../lib/db";
import { Feedback, type IFeedback } from "../../../models/Feedback";
import { format } from "date-fns";

export default async function Page({ params }: { params: { token: string } }) {
  const { token } = params;
  await connectToDB();
  const doc = await Feedback.findOne({ viewToken: token }).lean<IFeedback>();
  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <h1 className="text-xl font-semibold">Feedback Not Found</h1>
          <p className="text-gray-600">The link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-4">
        <h1 className="text-2xl font-semibold">Your Session Feedback</h1>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {doc.userName}</p>
          <p><span className="font-medium">Email:</span> {doc.userEmail}</p>
          <p><span className="font-medium">Session:</span> {format(new Date(doc.sessionAt), "PPpp")}</p>
        </div>
        <div className="space-y-2">
          <div>
            <h2 className="font-medium">Observations</h2>
            <p className="whitespace-pre-wrap text-gray-800">{doc.observations}</p>
          </div>
          <div>
            <h2 className="font-medium">Recommendations</h2>
            <p className="whitespace-pre-wrap text-gray-800">{doc.recommendations}</p>
          </div>
          {typeof doc.rating === "number" && (
            <p><span className="font-medium">Rating:</span> {doc.rating}/10</p>
          )}
        </div>
      </div>
    </div>
  );
}
