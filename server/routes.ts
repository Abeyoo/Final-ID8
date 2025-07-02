import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { personalityAI } from "./personalityAI";

export async function registerRoutes(app: Express): Promise<Server> {
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
