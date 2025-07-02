import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  personalityType: text("personality_type"),
  personalityScores: jsonb("personality_scores"), // Store scores for all 6 personality types
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  assessmentType: text("assessment_type").notNull(), // 'personality', 'strengths', 'interests', etc.
  questionId: text("question_id").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const teamInteractions = pgTable("team_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  teamId: integer("team_id"),
  actionType: text("action_type").notNull(), // 'created_team', 'joined_team', 'updated_progress', 'completed_task'
  actionData: jsonb("action_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const personalityAnalysis = pgTable("personality_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  analysisData: jsonb("analysis_data"), // Comprehensive personality analysis from AI
  confidence: real("confidence"), // AI confidence score (0-1)
  previousPersonality: text("previous_personality"),
  updatedPersonality: text("updated_personality"),
  reasoning: text("reasoning"), // AI explanation for personality update
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  timestamp: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertTeamInteractionSchema = createInsertSchema(teamInteractions).omit({
  id: true,
  timestamp: true,
});

export const insertPersonalityAnalysisSchema = createInsertSchema(personalityAnalysis).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type TeamInteraction = typeof teamInteractions.$inferSelect;
export type PersonalityAnalysis = typeof personalityAnalysis.$inferSelect;
