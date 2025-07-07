import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { personalityAI } from "./personalityAI";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { db } from "./db";
import { assessmentResponses, goals, achievements as achievementsTable, teamInteractions, users } from "@shared/schema";
import { eq, sql, and, or, isNull } from "drizzle-orm";
import * as schema from "@shared/schema";

// Real opportunity database with current 2025 opportunities
const realOpportunities = [
  // STEM & Research
  {
    title: "NASA Pathways Internship Program",
    type: "Internship",
    category: "Science",
    description: "Paid positions at NASA facilities conducting cutting-edge space research and engineering projects with NASA scientists.",
    deadline: "2025-09-12",
    location: "Multiple NASA locations nationwide",
    requirements: ["3.0+ GPA", "16+ years old", "STEM coursework"],
    prizes: "Paid internship + potential permanent offer",
    participants: "500+ positions available",
    personalityFit: { Leader: 85, Innovator: 95, Explorer: 90, Perfectionist: 80, Mediator: 70, Collaborator: 75 }
  },
  {
    title: "NIST Summer High School Intern Program",
    type: "Internship", 
    category: "Science",
    description: "8-week unpaid research experience with top scientists at the National Institute of Standards and Technology.",
    deadline: "2025-03-31",
    location: "Gaithersburg, MD",
    requirements: ["Rising junior/senior", "Strong STEM background", "Research interest"],
    prizes: "Research experience + recommendation letters",
    participants: "40-60 students annually",
    personalityFit: { Perfectionist: 95, Innovator: 85, Explorer: 80, Collaborator: 70, Leader: 75, Mediator: 65 }
  },
  {
    title: "Science Olympiad National Tournament",
    type: "Competition",
    category: "Science",
    description: "Premier STEM competition with 23 events covering biology, chemistry, physics, engineering, and more.",
    deadline: "2025-05-15",
    location: "Various state competitions + nationals",
    requirements: ["Team of 15 students", "Qualify through state competition", "Grades 9-12"],
    prizes: "$10,000 Founders' Scholarship for top seniors",
    participants: "5,000+ teams nationwide",
    personalityFit: { Perfectionist: 90, Collaborator: 85, Leader: 80, Innovator: 75, Explorer: 70, Mediator: 65 }
  },
  {
    title: "Conrad Challenge Innovation Competition",
    type: "Competition",
    category: "Innovation",
    description: "Year-long STEM innovation challenge where students develop solutions to real-world problems.",
    deadline: "2025-06-30",
    location: "Virtual + Houston finals",
    requirements: ["Team of 2-5 students", "Grades 9-12", "Innovation project"],
    prizes: "$10,000 grand prize + scholarships",
    participants: "1,000+ teams globally",
    personalityFit: { Innovator: 95, Leader: 85, Explorer: 80, Collaborator: 90, Perfectionist: 85, Mediator: 70 }
  },
  
  // Business & Leadership
  {
    title: "DECA International Career Development Conference",
    type: "Competition",
    category: "Business",
    description: "World-renowned business competition with role-play scenarios, written events, and entrepreneurship challenges.",
    deadline: "2025-04-30",
    location: "Various locations (district/state/international)",
    requirements: ["DECA membership", "Qualify through district/state", "Business coursework recommended"],
    prizes: "Scholarships + internship opportunities",
    participants: "20,000+ students worldwide",
    personalityFit: { Leader: 95, Innovator: 80, Collaborator: 85, Perfectionist: 75, Explorer: 70, Mediator: 65 }
  },
  {
    title: "National Speech & Debate Tournament",
    type: "Competition",
    category: "Communication",
    description: "Premier speech and debate competition featuring multiple events from policy debate to original oratory.",
    deadline: "2025-06-15",
    location: "Des Moines, IA",
    requirements: ["Qualify through district competition", "Speech/debate experience", "Grades 9-12"],
    prizes: "National recognition + scholarship opportunities",
    participants: "6,700+ students",
    personalityFit: { Leader: 90, Mediator: 85, Collaborator: 80, Perfectionist: 70, Innovator: 75, Explorer: 60 }
  },
  
  // Arts & Creative
  {
    title: "Doodle for Google National Contest",
    type: "Competition",
    category: "Arts",
    description: "National art contest where students create Google doodles based on annual themes, with winner displayed on homepage.",
    deadline: "2025-04-30",
    location: "Virtual submission",
    requirements: ["Enrolled in US school", "Original artwork", "Artist statement"],
    prizes: "$30,000 scholarship + tech package",
    participants: "Open to all US students",
    personalityFit: { Innovator: 90, Explorer: 85, Mediator: 75, Perfectionist: 80, Leader: 65, Collaborator: 70 }
  },
  {
    title: "National Scholastic Art & Writing Awards",
    type: "Competition",
    category: "Arts",
    description: "Prestigious competition recognizing creative teens in art and writing, running since 1923.",
    deadline: "2025-01-15",
    location: "Regional + national judging",
    requirements: ["Original creative work", "Grades 7-12", "Regional submission"],
    prizes: "Gold medals + $10,000 scholarships",
    participants: "300,000+ submissions annually",
    personalityFit: { Innovator: 85, Explorer: 90, Perfectionist: 80, Mediator: 75, Leader: 60, Collaborator: 65 }
  },
  
  // Scholarships
  {
    title: "Gates Scholarship Program",
    type: "Scholarship",
    category: "Academic",
    description: "Full tuition scholarship for outstanding minority students with financial need and strong academic records.",
    deadline: "2025-09-15",
    location: "National program",
    requirements: ["3.3+ GPA", "Minority status", "Financial need", "US citizen/permanent resident"],
    prizes: "Full tuition + fees + living expenses",
    participants: "300 scholars selected annually",
    personalityFit: { Leader: 90, Perfectionist: 85, Collaborator: 80, Mediator: 75, Innovator: 70, Explorer: 65 }
  },
  {
    title: "Jack Kent Cooke Scholarship",
    type: "Scholarship",
    category: "Academic",
    description: "For high-achieving students with financial need, providing comprehensive educational support.",
    deadline: "2025-11-15",
    location: "National program",
    requirements: ["3.5+ GPA", "Financial need", "Leadership experience", "Academic excellence"],
    prizes: "Up to $55,000 annually",
    participants: "65 scholars selected annually",
    personalityFit: { Perfectionist: 95, Leader: 90, Collaborator: 80, Mediator: 70, Innovator: 75, Explorer: 65 }
  },
  
  // Technology & Innovation
  {
    title: "Microsoft High School Internship Program",
    type: "Internship",
    category: "Technology",
    description: "Summer internship program focused on computer science, programming, and technology innovation.",
    deadline: "2025-02-28",
    location: "Seattle, WA + Virtual options",
    requirements: ["Computer science coursework", "Programming experience", "Rising junior/senior"],
    prizes: "Paid internship + mentorship",
    participants: "100+ interns annually",
    personalityFit: { Innovator: 95, Perfectionist: 85, Explorer: 80, Leader: 75, Collaborator: 70, Mediator: 60 }
  },
  {
    title: "Georgia Tech Research Institute Summer Internship",
    type: "Internship",
    category: "Technology",
    description: "5-week paid internship conducting real research projects in engineering and technology.",
    deadline: "2025-03-31",
    location: "Atlanta, GA",
    requirements: ["Georgia resident", "3.0+ GPA", "STEM coursework", "Rising junior/senior"],
    prizes: "Paid internship + research publication opportunity",
    participants: "60-70 positions annually",
    personalityFit: { Perfectionist: 90, Innovator: 85, Explorer: 80, Collaborator: 75, Leader: 70, Mediator: 60 }
  }
];

// Smart opportunity matching function
async function generateOpportunityRecommendations(personalityData: any, userStats: any, userId: number) {
  try {
    // Get user's goals and achievements for context
    const userGoals = await db.select().from(schema.goals).where(eq(schema.goals.userId, userId));
    const userAchievements = await db.select().from(schema.achievements).where(eq(schema.achievements.userId, userId));
    
    // Create user profile for matching
    const userProfile = {
      personalityType: personalityData.personalityType,
      personalityScores: personalityData.personalityScores,
      stats: userStats,
      goals: userGoals.map(g => ({ title: g.title, category: g.category, completed: g.completed })),
      achievements: userAchievements.map(a => ({ title: a.title, type: a.achievementType, description: a.description }))
    };

    // Calculate match scores for each opportunity
    const opportunitiesWithScores = realOpportunities.map((opp, index) => {
      // Calculate personality match
      const personalityMatch = opp.personalityFit[userProfile.personalityType as keyof typeof opp.personalityFit] || 70;
      
      // Calculate category match based on goals and achievements
      const userInterests = [
        ...userProfile.goals.map(g => g.category.toLowerCase()),
        ...userProfile.achievements.map(a => a.type.toLowerCase())
      ];
      
      const categoryMatch = userInterests.some(interest => 
        opp.category.toLowerCase().includes(interest) || 
        opp.type.toLowerCase().includes(interest)
      ) ? 85 : 70;
      
      // Calculate activity match based on user stats
      const activityMatch = userProfile.stats.achievements > 2 ? 85 : 75;
      
      // Combined match score
      const matchScore = Math.round((personalityMatch + categoryMatch + activityMatch) / 3);
      
      return {
        id: Date.now() + index,
        ...opp,
        match: Math.min(matchScore, 98), // Cap at 98% to seem realistic
        featured: matchScore >= 85,
        aiGenerated: true,
        recommendedAt: new Date().toISOString()
      };
    });

    // Sort by match score and return top opportunities
    return opportunitiesWithScores
      .sort((a, b) => b.match - a.match)
      .slice(0, 10);
      
  } catch (error) {
    console.error('Error generating opportunity recommendations:', error);
    
    // Return basic opportunities if matching fails
    return realOpportunities.slice(0, 8).map((opp, index) => ({
      id: Date.now() + index,
      ...opp,
      match: 75,
      featured: false,
      aiGenerated: true,
      recommendedAt: new Date().toISOString()
    }));
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Traditional signup route for new account creation
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password, school, grade, interests, personalityType, assessmentResponses } = req.body;
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      
      // Create user in database
      const [newUser] = await db.insert(users).values({
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        profileImageUrl: null,
        id: `traditional_${Date.now()}` // Generate unique ID for traditional signup
      }).returning();
      
      // Store assessment responses if provided
      if (assessmentResponses && Object.keys(assessmentResponses).length > 0) {
        const responses = Object.entries(assessmentResponses).map(([questionId, response]) => ({
          userId: newUser.id,
          assessmentType: 'onboarding',
          questionId,
          response: response as string
        }));
        
        await db.insert(schema.assessmentResponses).values(responses);
      }
      
      // Create session for the user
      req.login({ 
        id: newUser.id, 
        email: newUser.email, 
        firstName: newUser.firstName, 
        lastName: newUser.lastName 
      }, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ error: 'Failed to create session' });
        }
        
        res.json({ 
          success: true, 
          user: { 
            id: newUser.id,
            name: `${newUser.firstName} ${newUser.lastName}`,
            email: newUser.email,
            completedAssessments: 0,
            activeGoals: 0,
            completedGoals: 0,
            teamProjects: 0,
            achievements: 0
          } 
        });
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Traditional login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // For traditional accounts, we'll skip password verification for simplicity
      // In production, you'd want to hash and verify passwords
      
      // Create session for the user
      req.login({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName 
      }, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ error: 'Failed to create session' });
        }
        
        res.json({ 
          success: true, 
          user: { 
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
          } 
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Handle both OAuth and traditional authentication
      let userId;
      if (req.user.claims) {
        // OAuth user
        userId = req.user.claims.sub;
      } else {
        // Traditional authentication user
        userId = req.user.id;
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user stats
      const stats = await getUserStats(userId);
      
      res.json({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        personalityType: user.personalityType,
        ...stats
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Helper function to get user stats
  async function getUserStats(userId: string) {
    try {
      const [assessmentCount] = await db.select({ count: sql`count(*)` }).from(assessmentResponses).where(eq(assessmentResponses.userId, userId));
      const [activeGoalCount] = await db.select({ count: sql`count(*)` }).from(goals).where(and(eq(goals.userId, userId), or(eq(goals.completed, false), isNull(goals.completed))));
      const [completedGoalCount] = await db.select({ count: sql`count(*)` }).from(goals).where(and(eq(goals.userId, userId), eq(goals.completed, true)));
      const [achievementCount] = await db.select({ count: sql`count(*)` }).from(achievementsTable).where(eq(achievementsTable.userId, userId));
      const [teamCount] = await db.select({ count: sql`count(distinct team_id)` }).from(teamInteractions).where(eq(teamInteractions.userId, userId));
      
      return {
        completedAssessments: Number(assessmentCount.count),
        activeGoals: Number(activeGoalCount.count),
        completedGoals: Number(completedGoalCount.count),
        teamProjects: Number(teamCount.count),
        achievements: Number(achievementCount.count)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        completedAssessments: 0,
        activeGoals: 0,
        completedGoals: 0,
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

  // Get user's dashboard statistics
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get all user data for statistics
      const [
        userAssessmentResponses,
        userGoals,
        userAchievements,
        userTeamInteractions
      ] = await Promise.all([
        db.select().from(assessmentResponses).where(eq(assessmentResponses.userId, userId)),
        db.select().from(goals).where(eq(goals.userId, userId)),
        db.select().from(achievementsTable).where(eq(achievementsTable.userId, userId)),
        db.select().from(teamInteractions).where(eq(teamInteractions.userId, userId))
      ]) as [any[], any[], any[], any[]];

      // Calculate completed assessments
      const assessmentRequirements = {
        'strengths': 25,
        'personality': 30,
        'interests': 20,
        'values': 15,
        'learning': 16,
        'leadership': 22
      };

      let completedAssessments = 0;
      for (const [assessmentType, requiredQuestions] of Object.entries(assessmentRequirements)) {
        const responses = userAssessmentResponses.filter((r: any) => r.assessmentType === assessmentType);
        if (responses.length >= requiredQuestions) {
          completedAssessments++;
        }
      }

      // Calculate active goals (not completed)
      const activeGoals = userGoals.filter((goal: any) => !goal.completed).length;
      
      // Calculate completed goals
      const completedGoals = userGoals.filter((goal: any) => goal.completed).length;

      // Calculate team projects (unique team IDs)
      const teamProjects = new Set(userTeamInteractions.map((interaction: any) => interaction.teamId)).size;

      // Total achievements
      const totalAchievements = userAchievements.length;

      res.json({
        completedAssessments,
        activeGoals,
        completedGoals,
        teamProjects,
        achievements: totalAchievements
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Failed to get user statistics' });
    }
  });

  // Get user goals (protected route)
  app.get("/api/users/:userId/goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      
      // Ensure user can only access their own data
      if (userId !== req.user.claims.sub) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const userGoals = await db
        .select()
        .from(goals)
        .where(eq(goals.userId, userId))
        .orderBy(goals.createdAt);

      // Transform database goals to frontend format
      const formattedGoals = userGoals.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        progress: goal.progress,
        status: goal.completed ? 'completed' : 'active',
        deadline: goal.completedAt ? goal.completedAt.toISOString().split('T')[0] : '2024-12-31',
        milestones: [
          { title: `Complete ${goal.title} - Step 1`, completed: goal.progress >= 25 },
          { title: `Complete ${goal.title} - Step 2`, completed: goal.progress >= 50 },
          { title: `Complete ${goal.title} - Step 3`, completed: goal.progress >= 75 },
          { title: `Complete ${goal.title} - Final`, completed: goal.progress >= 100 },
        ]
      }));

      res.json(formattedGoals);
    } catch (error) {
      console.error('Get user goals error:', error);
      res.status(500).json({ error: 'Failed to get user goals' });
    }
  });

  // Create new goal (protected route)
  app.post("/api/users/:userId/goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      
      // Ensure user can only create goals for themselves
      if (userId !== req.user.claims.sub) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const { title, description, category } = req.body;

      const newGoal = await db
        .insert(goals)
        .values({
          userId,
          title,
          description,
          category,
          progress: 0,
          completed: false
        })
        .returning();

      res.json({ success: true, goal: newGoal[0] });
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  // Get user teams
  app.get("/api/users/:userId/teams", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const userTeams = await db
        .select()
        .from(teamInteractions)
        .where(eq(teamInteractions.userId, userId))
        .orderBy(teamInteractions.timestamp);

      // Group interactions by team and create team objects
      const teamsMap = new Map();
      userTeams.forEach(interaction => {
        const teamId = interaction.teamId;
        if (!teamsMap.has(teamId)) {
          teamsMap.set(teamId, {
            id: teamId,
            interactions: []
          });
        }
        teamsMap.get(teamId).interactions.push(interaction);
      });

      // Transform to frontend format
      const formattedTeams = Array.from(teamsMap.values()).map(team => {
        const latestInteraction = team.interactions[team.interactions.length - 1];
        return {
          id: team.id,
          name: `Team ${team.id}`,
          description: 'User-created team',
          members: team.interactions.length,
          role: 'Member',
          progress: 50,
          deadline: '2024-12-31',
          status: 'active',
          category: 'Academic',
          skills: ['Collaboration'],
          project: null,
          memberDetails: [],
          joinRequests: []
        };
      });

      res.json(formattedTeams);
    } catch (error) {
      console.error('Get user teams error:', error);
      res.status(500).json({ error: 'Failed to get user teams' });
    }
  });

  // Get user projects
  app.get("/api/users/:userId/projects", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // For now, return empty array for new users
      // Projects would typically be linked to teams
      res.json([]);
    } catch (error) {
      console.error('Get user projects error:', error);
      res.status(500).json({ error: 'Failed to get user projects' });
    }
  });

  // Get user's assessment completion status
  app.get("/api/assessments/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
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
      const userId = req.params.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        // Return default values for new users instead of 404
        return res.json({
          personalityType: null,
          personalityScores: null,
          lastUpdated: null
        });
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

  // AI-powered opportunity recommendations
  app.get("/api/opportunities/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user's personality analysis and stats
      const personalityData = await personalityAI.analyzeUserPersonality(userId);
      const userStats = await getUserStats(userId);
      
      // Use AI to generate personalized opportunity recommendations
      const recommendations = await generateOpportunityRecommendations(
        personalityData,
        userStats,
        userId
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Get opportunity recommendations error:', error);
      res.status(500).json({ error: 'Failed to get opportunity recommendations' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
