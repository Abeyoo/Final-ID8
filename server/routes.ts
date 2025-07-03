import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { personalityAI } from "./personalityAI";
import { db } from "./db";
import { assessmentResponses, goals, achievements, teamInteractions } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password, school, grade } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Create new user with initial empty state
      const newUser = await storage.createUser({
        username: email,
        password, // In production, hash this password
        name,
        email,
        personalityType: null,
        personalityScores: null
      });
      
      res.json({ 
        success: true, 
        user: { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email,
          completedAssessments: 0,
          activeGoals: 0,
          teamProjects: 0,
          achievements: 0
        } 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByUsername(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Get user stats
      const stats = await getUserStats(user.id);
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          personalityType: user.personalityType,
          ...stats
        } 
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  });

  // Helper function to get user stats
  async function getUserStats(userId: number) {
    try {
      const [assessmentCount] = await db.select({ count: sql`count(*)` }).from(assessmentResponses).where(eq(assessmentResponses.userId, userId));
      const [goalCount] = await db.select({ count: sql`count(*)` }).from(goals).where(eq(goals.userId, userId));
      const [achievementCount] = await db.select({ count: sql`count(*)` }).from(achievements).where(eq(achievements.userId, userId));
      const [teamCount] = await db.select({ count: sql`count(distinct team_id)` }).from(teamInteractions).where(eq(teamInteractions.userId, userId));
      
      return {
        completedAssessments: Number(assessmentCount.count),
        activeGoals: Number(goalCount.count),
        teamProjects: Number(teamCount.count),
        achievements: Number(achievementCount.count)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        completedAssessments: 0,
        activeGoals: 0,
        teamProjects: 0,
        achievements: 0
      };
    }
  }

  // Personality Analysis Routes
  
  // Track assessment response and trigger personality analysis
  app.post("/api/assessment/response", async (req, res) => {
    try {
      const { userId, assessmentType, questionId, response } = req.body;
      
      // Track the response
      await personalityAI.trackAssessmentResponse(userId, assessmentType, questionId, response);
      
      // Trigger personality analysis if this is a personality assessment
      if (assessmentType === 'personality') {
        const analysis = await personalityAI.analyzeUserPersonality(userId);
        res.json({ success: true, personalityUpdate: analysis });
      } else {
        res.json({ success: true });
      }
    } catch (error) {
      console.error('Assessment response error:', error);
      res.status(500).json({ error: 'Failed to track assessment response' });
    }
  });

  // Track goal creation
  app.post("/api/goals", async (req, res) => {
    try {
      const { userId, title, description, category } = req.body;
      
      await personalityAI.trackGoalCreation(userId, { title, description, category });
      
      // Trigger personality analysis after goal creation
      const analysis = await personalityAI.analyzeUserPersonality(userId);
      
      res.json({ success: true, personalityUpdate: analysis });
    } catch (error) {
      console.error('Goal creation error:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  // Track goal completion
  app.post("/api/goals/:goalId/complete", async (req, res) => {
    try {
      const { userId } = req.body;
      const goalId = parseInt(req.params.goalId);
      
      await personalityAI.trackGoalCompletion(userId, goalId);
      
      // Track achievement for goal completion
      await personalityAI.trackAchievement(
        userId, 
        'goal_completion', 
        'Goal Achieved', 
        'Successfully completed a personal development goal'
      );
      
      // Trigger personality analysis
      const analysis = await personalityAI.analyzeUserPersonality(userId);
      
      res.json({ success: true, personalityUpdate: analysis });
    } catch (error) {
      console.error('Goal completion error:', error);
      res.status(500).json({ error: 'Failed to complete goal' });
    }
  });

  // Track team interactions
  app.post("/api/teams/:teamId/interaction", async (req, res) => {
    try {
      const { userId, actionType, actionData } = req.body;
      const teamId = parseInt(req.params.teamId);
      
      await personalityAI.trackTeamInteraction(userId, teamId, actionType, actionData);
      
      // Trigger personality analysis for leadership actions
      if (['created_team', 'updated_progress', 'resolved_conflict'].includes(actionType)) {
        const analysis = await personalityAI.analyzeUserPersonality(userId);
        res.json({ success: true, personalityUpdate: analysis });
      } else {
        res.json({ success: true });
      }
    } catch (error) {
      console.error('Team interaction error:', error);
      res.status(500).json({ error: 'Failed to track team interaction' });
    }
  });

  // Manually trigger personality analysis
  app.post("/api/personality/analyze/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const analysis = await personalityAI.analyzeUserPersonality(userId);
      res.json(analysis);
    } catch (error) {
      console.error('Manual personality analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze personality' });
    }
  });

  // Get user's assessment completion status
  app.get("/api/assessments/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get assessment responses to determine completion status
      const userAssessmentResponses = await db.select().from(assessmentResponses).where(eq(assessmentResponses.userId, userId));
      
      // Define minimum questions needed to complete each assessment
      const assessmentRequirements = {
        'strengths': 25,
        'personality': 30,
        'interests': 20,
        'values': 15,
        'learning': 16,
        'leadership': 22
      };

      // Calculate completion status for each assessment
      const completionStatus: Record<string, boolean> = {};
      for (const [assessmentType, requiredQuestions] of Object.entries(assessmentRequirements)) {
        const responses = userAssessmentResponses.filter((r: any) => r.assessmentType === assessmentType);
        completionStatus[assessmentType] = responses.length >= requiredQuestions;
      }

      res.json(completionStatus);
    } catch (error) {
      console.error('Get assessments error:', error);
      res.status(500).json({ error: 'Failed to get assessment data' });
    }
  });

  // Get user's personality insights
  app.get("/api/personality/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        personalityType: user.personalityType,
        personalityScores: user.personalityScores,
        lastUpdated: user.updatedAt
      });
    } catch (error) {
      console.error('Get personality error:', error);
      res.status(500).json({ error: 'Failed to get personality data' });
    }
  });

  // Track achievement
  app.post("/api/achievements", async (req, res) => {
    try {
      const { userId, achievementType, title, description } = req.body;
      
      await personalityAI.trackAchievement(userId, achievementType, title, description);
      
      // Trigger personality analysis for significant achievements
      if (['leadership', 'innovation', 'collaboration'].includes(achievementType)) {
        const analysis = await personalityAI.analyzeUserPersonality(userId);
        res.json({ success: true, personalityUpdate: analysis });
      } else {
        res.json({ success: true });
      }
    } catch (error) {
      console.error('Achievement tracking error:', error);
      res.status(500).json({ error: 'Failed to track achievement' });
    }
  });

  // Track opportunity interactions
  app.post("/api/opportunities/interaction", async (req, res) => {
    try {
      const { userId, opportunityType, category, title, actionType, interactionData } = req.body;
      
      await personalityAI.trackOpportunityInteraction(
        userId, 
        opportunityType, 
        category, 
        title, 
        actionType, 
        interactionData
      );
      
      // Trigger personality analysis for significant opportunity actions
      if (['applied', 'completed_application'].includes(actionType)) {
        const analysis = await personalityAI.analyzeUserPersonality(userId);
        res.json({ success: true, personalityUpdate: analysis });
      } else {
        res.json({ success: true });
      }
    } catch (error) {
      console.error('Opportunity tracking error:', error);
      res.status(500).json({ error: 'Failed to track opportunity interaction' });
    }
  });

  // Get user's personality percentiles
  app.get("/api/personality/:userId/percentiles", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const percentiles = await personalityAI.getUserPercentiles(userId);
      res.json(percentiles);
    } catch (error) {
      console.error('Get percentiles error:', error);
      res.status(500).json({ error: 'Failed to get personality percentiles' });
    }
  });

  // Recalculate all percentiles (admin endpoint)
  app.post("/api/personality/recalculate-percentiles", async (req, res) => {
    try {
      await personalityAI.recalculateAllPercentiles();
      res.json({ success: true, message: 'Percentiles recalculated for all users' });
    } catch (error) {
      console.error('Recalculate percentiles error:', error);
      res.status(500).json({ error: 'Failed to recalculate percentiles' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
