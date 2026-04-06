"use server";

import { EndSessionResult, Messages, StartSessionResult } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import BookTranscript from "@/database/models/book-transcript.model";
import { auth } from "@clerk/nextjs/server";
import { getPlanLimits, getUserPlan } from "@/lib/subscription.server";
import { PLAN_LIMITS, getCurrentBillingPeriodStart } from "@/lib/subscription-constants";

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();

    const { userId } = await auth();

    if (!userId || userId !== clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const billingPeriodStart = getCurrentBillingPeriodStart();

    if (limits.maxSessionsPerMonth !== Infinity) {
      const sessionCount = await VoiceSession.countDocuments({
        clerkId,
        billingPeriodStart,
      });

      if (sessionCount >= limits.maxSessionsPerMonth) {
        return {
          success: false,
          error: `You have reached the monthly session limit for your ${plan} plan (${limits.maxSessionsPerMonth} sessions). Please upgrade to continue.`,
          isBillingError: true,
        };
      }
    }

    const session = await VoiceSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart,
      durationSeconds: 0,
    });

    return {
      success: true,
      sessionId: session._id.toString(),
      maxDurationMinutes: limits.maxDurationPerSession,
    };
  } catch (e) {
    console.error("Error starting voice session", e);
    return { success: false, error: "Failed to start voice session. Please try again later." };
  }
};

export const getMaxSessionDuration = async (): Promise<number | null> => {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const limits = await getPlanLimits();
    return limits.maxDurationPerSession === Infinity ? null : limits.maxDurationPerSession;
  } catch (e) {
    console.error("Error fetching plan limits", e);
    return null;
  }
};

export const getBookTranscript = async (bookId: string): Promise<Messages[]> => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId) return [];

    const transcript = await BookTranscript.findOne({ clerkId: userId, bookId }).lean();
    return (transcript?.messages ?? []).map(({ role, content }) => ({ role, content }));
  } catch (e) {
    console.error("Error loading transcript", e);
    return [];
  }
};

export const saveBookTranscript = async (bookId: string, messages: Messages[]): Promise<void> => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId || messages.length === 0) return;

    await BookTranscript.findOneAndUpdate(
      { clerkId: userId, bookId },
      { messages },
      { upsert: true, new: true },
    );
  } catch (e) {
    console.error("Error saving transcript", e);
  }
};

export const clearBookTranscript = async (bookId: string): Promise<void> => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId) return;

    await BookTranscript.deleteOne({ clerkId: userId, bookId });
  } catch (e) {
    console.error("Error clearing transcript", e);
  }
};

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();

    const result = await VoiceSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      durationSeconds,
    });

    if (!result) return { success: false, error: "Voice session not found." };

    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return { success: false, error: "Failed to end voice session. Please try again later." };
  }
};
