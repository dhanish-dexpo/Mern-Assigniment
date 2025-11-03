import { Schema, model, models } from "mongoose";

export interface IFeedback {
  userName: string;
  userEmail: string;
  sessionAt: Date;
  observations: string;
  recommendations: string;
  rating?: number;
  createdByEmail: string;
  viewToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, index: true },
    sessionAt: { type: Date, required: true },
    observations: { type: String, required: true },
    recommendations: { type: String, required: true },
    rating: { type: Number },
    createdByEmail: { type: String, required: true },
    viewToken: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const Feedback = models.Feedback || model<IFeedback>("Feedback", FeedbackSchema);
