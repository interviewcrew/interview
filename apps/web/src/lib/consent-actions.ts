"use server";

import { headers } from "next/headers";
import { createHash } from "crypto";
import { db } from "@/db";
import { consentLogs } from "@/db/schema";
import { auth } from "@/lib/auth";

type ConsentSnapshot = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

function hashIpAddress(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function logConsentAction(
  consentSnapshot: ConsentSnapshot,
  status: string
): Promise<{ success: boolean }> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp;
    const userAgent = headersList.get("user-agent");

    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({ headers: headersList });
      userId = session?.user?.id ?? null;
    } catch {
      userId = null;
    }

    await db.insert(consentLogs).values({
      userId,
      ipAddressHash: hashIpAddress(ip),
      consentSnapshot,
      status,
      userAgent,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to log consent:", error);
    return { success: false };
  }
}

