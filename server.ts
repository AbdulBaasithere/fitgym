import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for lazy Gemini AI instance
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // API Route: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: AI Churn Analysis & Personalized Motivational Message
  app.post("/api/gemini/generate-outreach", async (req, res) => {
    try {
      const { member, tone, gymName = "FitPulse Gym" } = req.body;
      if (!member) {
        return res.status(400).json({ error: "Member data is required" });
      }

      const ai = getAI();
      if (!ai) {
        // High quality fallback if API key is not yet set
        const defaultMessages: Record<string, string> = {
          empathetic: `Hey ${member.name.split(" ")[0]}! We noticed life might have gotten busy lately and we genuinely miss your energy at ${gymName}. No pressure at all—even a 20-minute stretch or light session this week can restart your momentum. We reserved your favorite spot!`,
          coach: `Coach alert for ${member.name.split(" ")[0]}! You built an incredible foundation with ${member.totalWorkouts || 12} workouts. Don't let your progress slip away. Let's get 1 solid session logged before the weekend. You've got this!`,
          incentive: `Special VIP Pass for ${member.name.split(" ")[0]}! We want to welcome you back to ${gymName}. Show this message at the front desk for a complimentary Post-Workout Protein Smoothie + 150 Bonus XP on your next check-in!`,
          recovery: `Hey ${member.name.split(" ")[0]}, your ${member.previousStreak || 7}-day streak may have paused, but your comeback starts today! We activated the 3-Day Streak Recovery Quest on your profile with 2x XP boost.`
        };

        const message = defaultMessages[tone] || defaultMessages.empathetic;
        return res.json({
          message,
          recommendations: [
            "Schedule a low-friction 25-minute workout session",
            "Offer complimentary recovery shake or guest pass",
            "Assign a customized 3-day micro-challenge to restore streak"
          ],
          retentionScoreDeltaEstimated: "+24%",
          generatedBy: "smart-fallback"
        });
      }

      const prompt = `
You are the Head Retention Specialist & Lead Fitness Coach at "${gymName}".
Analyze this gym member's profile and generate:
1. A hyper-personalized, engaging, non-robotic retention/motivational message to re-engage them.
2. 3 concrete tactical retention recommendations for the gym staff.

Member Profile:
- Name: ${member.name}
- Membership Tier: ${member.tier || "Standard"}
- Days Inactive: ${member.daysSinceLastVisit || 8} days
- Previous Streak: ${member.previousStreak || 0} days (Current: ${member.currentStreak || 0} days)
- Total Workouts Logged: ${member.totalWorkouts || 15}
- Preferred Workout Types: ${(member.favoriteWorkouts || ["Strength", "Cardio"]).join(", ")}
- Churn Risk Level: ${member.churnRisk?.level || "Moderate"} (${member.churnRisk?.score || 55}%)
- Root Cause Identified: ${member.churnRisk?.rootCause || "Attendance drop-off after streak break"}
- Desired Tone: ${tone || "empathetic and motivating"}

Format response strictly as JSON with keys:
- "message": A 2-4 sentence personalized text/push notification message (warm, human, motivating, no cheesy clichés).
- "recommendations": Array of 3 short tactical staff action items.
- "retentionScoreDeltaEstimated": e.g. "+30% probability increase".
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ ...parsed, generatedBy: "gemini-2.5-flash" });
    } catch (error: any) {
      console.error("Gemini outreach generation error:", error);
      return res.status(500).json({
        error: "Failed to generate AI outreach",
        details: error?.message,
      });
    }
  });

  // API Route: AI Cohort Retention Strategy
  app.post("/api/gemini/cohort-strategy", async (req, res) => {
    try {
      const { atRiskCount, avgInactiveDays, topChurnReason } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          strategyTitle: "3-Tier Revival & Habit Reset Blitz",
          summary: `Targeting ${atRiskCount || 14} members showing drop-offs averaging ${avgInactiveDays || 9} days. Focus on reducing friction through micro-commitments and VIP incentives.`,
          actionSteps: [
            "Automated 'Comeback Champion' 3-day challenge activation with double XP.",
            "Free guest pass invite to bring a workout buddy (boosts retention by 42%).",
            "Coach check-in phone/SMS consultation for members >14 days inactive."
          ],
          incentiveIdea: "Free Functional Fitness Assessment + Protein Shake voucher.",
          generatedBy: "smart-fallback"
        });
      }

      const prompt = `
As an elite Gym Business & Member Retention Consultant, create a high-impact 7-day retention blitz strategy for a cohort of at-risk members.
Cohort summary:
- Total At-Risk Members: ${atRiskCount || 15}
- Average Inactive Days: ${avgInactiveDays || 8}
- Dominant Churn Factor: ${topChurnReason || "Streak breakage & missed visits in 2nd month"}

Provide JSON output with:
- "strategyTitle": Catchy tactical campaign title.
- "summary": 2 sentence executive summary.
- "actionSteps": 3 distinct operational steps for gym staff.
- "incentiveIdea": 1 high-converting, low-cost gym incentive.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ ...parsed, generatedBy: "gemini-2.5-flash" });
    } catch (error: any) {
      console.error("Gemini cohort strategy error:", error);
      return res.status(500).json({ error: "Failed to generate cohort strategy" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitPulse server running on http://localhost:${PORT}`);
  });
}

startServer();
