import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Replit user ID (string)
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  personalityType: text("personality_type"),
  personalityScores: jsonb("personality_scores"), // Store scores for all 6 personality types
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  assessmentType: text("assessment_type").notNull(), // 'personality', 'strengths', 'interests', etc.
  questionId: text("question_id").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
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
  userId: varchar("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: varchar("creator_id").references(() => users.id),
  category: text("category").notNull(),
  skills: text("skills").array(),
  maxMembers: integer("max_members").default(5),
  isPrivate: boolean("is_private").default(false),
  status: text("status").default("active"), // 'active', 'completed', 'paused'
  progress: integer("progress").default(0),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  userId: varchar("user_id").references(() => users.id),
  role: text("role").default("Member"), // 'Team Leader', 'Member', 'Admin'
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const teamInteractions = pgTable("team_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  actionType: text("action_type").notNull(), // 'created_team', 'joined_team', 'updated_progress', 'completed_task'
  actionData: jsonb("action_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  opportunityType: text("opportunity_type").notNull(), // 'competition', 'internship', 'scholarship', 'program'
  category: text("category").notNull(), // 'STEM', 'Arts', 'Leadership', 'Sports', etc.
  title: text("title").notNull(),
  description: text("description"),
  actionType: text("action_type").notNull(), // 'viewed', 'applied', 'bookmarked', 'shared'
  interactionData: jsonb("interaction_data"), // Additional context about the interaction
  timestamp: timestamp("timestamp").defaultNow(),
});

export const personalityPercentiles = pgTable("personality_percentiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  personalityType: text("personality_type").notNull(),
  percentile: real("percentile").notNull(), // 0-100 percentile rank
  scoreHistory: jsonb("score_history"), // Historical scores for trending
  lastCalculated: timestamp("last_calculated").defaultNow(),
});

export const personalityAnalysis = pgTable("personality_analysis", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  analysisData: jsonb("analysis_data"), // Comprehensive personality analysis from AI
  confidence: real("confidence"), // AI confidence score (0-1)
  previousPersonality: text("previous_personality"),
  updatedPersonality: text("updated_personality"),
  reasoning: text("reasoning"), // AI explanation for personality update
  percentileChanges: jsonb("percentile_changes"), // Before/after percentiles
  opportunityPatterns: jsonb("opportunity_patterns"), // Analyzed opportunity preferences
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  personalityType: true,
  personalityScores: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
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

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertTeamInteractionSchema = createInsertSchema(teamInteractions).omit({
  id: true,
  timestamp: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  timestamp: true,
});

export const insertPersonalityPercentileSchema = createInsertSchema(personalityPercentiles).omit({
  id: true,
  lastCalculated: true,
});

export const insertPersonalityAnalysisSchema = createInsertSchema(personalityAnalysis).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamInteraction = typeof teamInteractions.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type PersonalityPercentile = typeof personalityPercentiles.$inferSelect;
export type PersonalityAnalysis = typeof personalityAnalysis.$inferSelect;
