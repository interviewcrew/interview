"use server";

import { db } from "@/db";
import { contactInquiries } from "@/db/schema";
import { z } from "zod";
import { contactFormSchema } from "@/modules/landing/schemas";

export async function submitContactForm(data: z.infer<typeof contactFormSchema>) {
  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    await db.insert(contactInquiries).values({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      role: result.data.role,
      message: result.data.message,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
