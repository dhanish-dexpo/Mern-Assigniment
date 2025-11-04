"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Schema = z.object({
  userName: z.string().min(2),
  userEmail: z.string().email(),
  sessionAt: z.string().min(1),
  observations: z.string().min(5),
  recommendations: z.string().min(5),
  rating: z
    .number()
    .min(0, "Rating must be between 0 and 10")
    .max(10, "Rating must be between 0 and 10")
    .optional()
    .or(z.nan().transform(() => undefined)),
});

type FormValues = z.infer<typeof Schema>;

export default function HRFeedbackForm() {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      reset();
      alert("Feedback submitted and email sent (if configured)");
    } catch (e: any) {
      alert(e?.message || "Submit failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Record Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="userName">User Name</Label>
              <Input id="userName" {...register("userName")} />
              {formState.errors.userName && (
                <p className="text-sm text-red-600">{formState.errors.userName.message as string}</p>
              )}
            </div>
            <div>
              <Label htmlFor="userEmail">User Email</Label>
              <Input id="userEmail" type="email" {...register("userEmail")} />
              {formState.errors.userEmail && (
                <p className="text-sm text-red-600">{formState.errors.userEmail.message as string}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sessionAt">Session Date & Time</Label>
              <Input id="sessionAt" type="datetime-local" {...register("sessionAt")} />
              {formState.errors.sessionAt && (
                <p className="text-sm text-red-600">{formState.errors.sessionAt.message as string}</p>
              )}
            </div>
            <div>
              <Label htmlFor="observations">Observations</Label>
              <Textarea id="observations" rows={4} {...register("observations")} />
              {formState.errors.observations && (
                <p className="text-sm text-red-600">{formState.errors.observations.message as string}</p>
              )}
            </div>
            <div>
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea id="recommendations" rows={4} {...register("recommendations")} />
              {formState.errors.recommendations && (
                <p className="text-sm text-red-600">{formState.errors.recommendations.message as string}</p>
              )}
            </div>
            <div>
              <Label htmlFor="rating">Overall Rating (0-10)</Label>
              <Input id="rating" type="number" min={0} max={10} step={1} {...register("rating", { valueAsNumber: true })} />
              {formState.errors.rating && (
                <p className="text-sm text-red-600">{formState.errors.rating.message as string}</p>
              )}
            </div>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
