"use client";

import { useAuth } from "@clerk/nextjs";
import { PLANS, PLAN_LIMITS, PlanType } from "@/lib/subscription-constants";

export const useUserPlan = (): PlanType => {
  const { has } = useAuth();

  if (has?.({ plan: "pro" })) return PLANS.PRO;
  if (has?.({ plan: "standard" })) return PLANS.STANDARD;

  return PLANS.FREE;
};

export const usePlanLimits = () => {
  const plan = useUserPlan();
  return PLAN_LIMITS[plan];
};
