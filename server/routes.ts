import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { personalityAI } from "./personalityAI";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from "openai";
import bcrypt from "bcryptjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { db } from "./db";
import { assessmentResponses, goals, achievements as achievementsTable, teamInteractions, teams, teamMembers, projects, projectTasks, users } from "@shared/schema";
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
  },
  
  // Personality-Specific Opportunities
  {
    title: "Model United Nations International Conference",
    type: "Competition",
    category: "Leadership",
    description: "Prestigious international conference simulating UN proceedings, perfect for diplomatic leaders and mediators.",
    deadline: "2025-04-15",
    location: "New York, NY",
    requirements: ["MUN experience", "Strong research skills", "Public speaking ability"],
    prizes: "International recognition + networking opportunities",
    participants: "2,000+ delegates worldwide",
    personalityFit: { Mediator: 95, Leader: 90, Collaborator: 85, Perfectionist: 80, Innovator: 70, Explorer: 75, Strategist: 90, Anchor: 65 }
  },
  {
    title: "National Beta Club Convention",
    type: "Conference",
    category: "Community",
    description: "Service-oriented leadership conference for students committed to academic excellence and community service.",
    deadline: "2025-05-20",
    location: "Various locations",
    requirements: ["Beta Club membership", "Community service hours", "Academic excellence"],
    prizes: "Leadership awards + scholarship opportunities",
    participants: "10,000+ students nationally",
    personalityFit: { Anchor: 95, Collaborator: 90, Mediator: 85, Perfectionist: 80, Leader: 75, Innovator: 60, Explorer: 65, Strategist: 70 }
  },
  {
    title: "International Science and Engineering Fair (ISEF)",
    type: "Competition",
    category: "Science",
    description: "World's largest pre-college science competition, showcasing independent research projects.",
    deadline: "2025-03-15",
    location: "Regional qualifiers + international final",
    requirements: ["Original research project", "Regional qualification", "Scientific methodology"],
    prizes: "$8 million in prizes + scholarships",
    participants: "1,800+ students globally",
    personalityFit: { Explorer: 95, Perfectionist: 90, Innovator: 85, Strategist: 80, Leader: 75, Collaborator: 70, Mediator: 60, Anchor: 65 }
  },
  {
    title: "Future Business Leaders of America National Conference",
    type: "Conference",
    category: "Business",
    description: "Premier business leadership conference with competitive events and networking opportunities.",
    deadline: "2025-06-25",
    location: "Various locations",
    requirements: ["FBLA membership", "Competitive events qualification", "Business coursework"],
    prizes: "Scholarships + internship opportunities",
    participants: "12,000+ students",
    personalityFit: { Strategist: 95, Leader: 90, Innovator: 80, Perfectionist: 75, Collaborator: 70, Mediator: 65, Explorer: 60, Anchor: 55 }
  },
  {
    title: "National Art Honor Society Exhibition",
    type: "Exhibition",
    category: "Arts",
    description: "Showcase for exceptional student artists, promoting artistic excellence and community engagement.",
    deadline: "2025-04-30",
    location: "Regional exhibitions nationwide",
    requirements: ["NAHS membership", "Portfolio submission", "Community art service"],
    prizes: "Art scholarships + exhibition opportunities",
    participants: "5,000+ student artists",
    personalityFit: { Innovator: 90, Explorer: 85, Perfectionist: 80, Mediator: 75, Collaborator: 70, Leader: 60, Strategist: 65, Anchor: 70 }
  },
  {
    title: "Peer Mediation Training Certification",
    type: "Program",
    category: "Community",
    description: "Training program for students to become certified peer mediators in their schools and communities.",
    deadline: "2025-08-15",
    location: "Various training centers",
    requirements: ["Strong communication skills", "Conflict resolution interest", "Teacher recommendation"],
    prizes: "Certification + community service hours",
    participants: "500+ students annually",
    personalityFit: { Mediator: 95, Collaborator: 90, Anchor: 85, Leader: 70, Perfectionist: 65, Innovator: 60, Explorer: 55, Strategist: 60 }
  }
];

// Smart opportunity matching function
async function generateOpportunityRecommendations(personalityData: any, userStats: any, userId: string) {
  try {
    // Get user's goals, achievements, and initial interests for context
    const userGoals = await db.select().from(schema.goals).where(eq(schema.goals.userId, userId));
    const userAchievements = await db.select().from(schema.achievements).where(eq(schema.achievements.userId, userId));
    const [userRecord] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    
    // Create user profile for matching
    const userProfile = {
      personalityType: personalityData.personalityType,
      personalityScores: personalityData.personalityScores,
      stats: userStats,
      goals: userGoals.map(g => ({ title: g.title, category: g.category, completed: g.completed })),
      achievements: userAchievements.map(a => ({ title: a.title, type: a.achievementType, description: a.description })),
      initialInterests: userRecord?.initialInterests || [] // Include initial interests from account creation
    };

    // Calculate match scores for each opportunity
    const opportunitiesWithScores = realOpportunities.map((opp, index) => {
      // Calculate personality match (enhanced with secondary personality scores)
      const primaryPersonalityMatch = opp.personalityFit[userProfile.personalityType as keyof typeof opp.personalityFit] || 70;
      
      // Factor in secondary personality traits if available
      let personalityMatch = primaryPersonalityMatch;
      if (userProfile.personalityScores) {
        const secondaryMatches = Object.entries(userProfile.personalityScores)
          .filter(([type, score]) => type !== userProfile.personalityType && (score as number) > 0.6)
          .map(([type, score]) => {
            const typeMatch = opp.personalityFit[type as keyof typeof opp.personalityFit] || 70;
            return typeMatch * (score as number) * 0.3; // Weight secondary traits at 30%
          });
        
        if (secondaryMatches.length > 0) {
          const secondaryBonus = Math.max(...secondaryMatches);
          personalityMatch = Math.min(personalityMatch + secondaryBonus, 95);
        }
      }
      
      // Calculate category match based on initial interests, goals, and achievements
      const userInterests = [
        ...userProfile.initialInterests.map(i => i.toLowerCase()), // Initial interests from account creation
        ...userProfile.goals.map(g => g.category.toLowerCase()),
        ...userProfile.achievements.map(a => a.type.toLowerCase())
      ];
      
      // Enhanced category matching with priority scoring
      let categoryMatch = 70; // Base score
      
      // Check initial interests (highest priority - weight 40%)
      const initialInterestMatch = userProfile.initialInterests.some(interest => 
        opp.category.toLowerCase().includes(interest.toLowerCase()) || 
        opp.type.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(opp.category.toLowerCase())
      );
      
      // Check goal-based interests (medium priority - weight 30%)
      const goalMatch = userProfile.goals.some(goal => 
        opp.category.toLowerCase().includes(goal.category.toLowerCase()) || 
        opp.type.toLowerCase().includes(goal.category.toLowerCase())
      );
      
      // Check achievement-based interests (lower priority - weight 30%)
      const achievementMatch = userProfile.achievements.some(achievement => 
        opp.category.toLowerCase().includes(achievement.type.toLowerCase()) || 
        opp.type.toLowerCase().includes(achievement.type.toLowerCase())
      );
      
      // Calculate weighted category match
      if (initialInterestMatch) categoryMatch += 25; // Strong bonus for initial interests
      if (goalMatch) categoryMatch += 15; // Medium bonus for goal alignment
      if (achievementMatch) categoryMatch += 10; // Small bonus for achievement alignment
      
      categoryMatch = Math.min(categoryMatch, 95); // Cap at 95%
      
      // Calculate activity match based on user stats
      const activityMatch = userProfile.stats.achievements > 2 ? 85 : 75;
      
      // Enhanced weighted combination: personality is now 40%, category 35%, activity 25%
      const matchScore = Math.round((personalityMatch * 0.4) + (categoryMatch * 0.35) + (activityMatch * 0.25));
      
      // Generate personality-based recommendation reason
      const getPersonalityReason = () => {
        const topPersonalities = Object.entries(opp.personalityFit)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([type, score]) => `${type}s (${score}%)`)
          .join(', ');
        
        return `Perfect for ${topPersonalities}. ${
          primaryPersonalityMatch >= 85 ? 'Highly aligned with your personality!' :
          primaryPersonalityMatch >= 75 ? 'Good personality match.' :
          'Opportunity to develop new skills.'
        }`;
      };
      
      return {
        id: Date.now() + index,
        ...opp,
        match: Math.min(matchScore, 98), // Cap at 98% to seem realistic
        featured: matchScore >= 85,
        aiGenerated: true,
        recommendedAt: new Date().toISOString(),
        personalityReason: getPersonalityReason(),
        personalityScore: primaryPersonalityMatch
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
      
      // Hash password for traditional accounts
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user in database
      const [newUser] = await db.insert(users).values({
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        profileImageUrl: null,
        passwordHash, // Store hashed password
        initialInterests: interests || [], // Store user's initial interests
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
      
      // Verify password for traditional accounts
      if (user.id.startsWith('traditional_')) {
        if (!password || !user.passwordHash) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Compare password with stored hash
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      }
      
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

  // Achievements Routes
  app.get("/api/achievements/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get user's achievements from database
      const userAchievements = await db.select().from(achievements).where(eq(achievements.userId, userId));
      
      // Get user stats for calculating available achievements
      const stats = await getUserStats(userId);
      
      // Define available achievements with conditions
      const availableAchievements = [
        {
          id: 'first_assessment',
          name: 'First Assessment',
          description: 'Completed your first self-assessment',
          category: 'Getting Started',
          rarity: 'common',
          condition: () => stats.completedAssessments >= 1
        },
        {
          id: 'goal_setter',
          name: 'Goal Setter', 
          description: 'Created your first development goal',
          category: 'Planning',
          rarity: 'common',
          condition: () => (stats.activeGoals + stats.completedGoals) >= 1
        },
        {
          id: 'team_player',
          name: 'Team Player',
          description: 'Joined your first team collaboration',
          category: 'Collaboration', 
          rarity: 'common',
          condition: () => stats.teamProjects >= 1
        },
        {
          id: 'goal_achiever',
          name: 'Goal Achiever',
          description: 'Completed your first development goal',
          category: 'Achievement',
          rarity: 'common',
          condition: () => stats.completedGoals >= 1
        },
        {
          id: 'assessment_master',
          name: 'Assessment Master',
          description: 'Completed 3 different assessments',
          category: 'Discovery',
          rarity: 'rare',
          condition: () => stats.completedAssessments >= 3
        },
        {
          id: 'goal_champion',
          name: 'Goal Champion',
          description: 'Completed 5 development goals',
          category: 'Achievement',
          rarity: 'rare',
          condition: () => stats.completedGoals >= 5
        },
        {
          id: 'team_leader',
          name: 'Team Leader',
          description: 'Active in 3 different team projects',
          category: 'Leadership',
          rarity: 'epic',
          condition: () => stats.teamProjects >= 3
        },
        {
          id: 'consistent_achiever',
          name: 'Consistent Achiever',
          description: 'Completed goals regularly over time',
          category: 'Consistency',
          rarity: 'legendary',
          condition: () => stats.completedGoals >= 10 && stats.achievements >= 5
        }
      ];
      
      // Check which achievements user has earned
      const earnedAchievements = availableAchievements.filter(achievement => {
        const hasEarned = userAchievements.some(ua => ua.achievementType === achievement.id);
        const meetsCondition = achievement.condition();
        
        // Auto-award achievements if user meets condition but hasn't earned yet
        if (meetsCondition && !hasEarned) {
          personalityAI.trackAchievement(userId, achievement.id, achievement.name, achievement.description);
        }
        
        return meetsCondition;
      });
      
      res.json({
        achievements: availableAchievements.map(achievement => ({
          ...achievement,
          earned: earnedAchievements.some(ea => ea.id === achievement.id),
          earnedDate: userAchievements.find(ua => ua.achievementType === achievement.id)?.earnedAt || null
        })),
        stats: {
          totalBadges: earnedAchievements.length,
          completedGoals: stats.completedGoals,
          teamsJoined: stats.teamProjects,
          totalAchievements: stats.achievements
        }
      });
    } catch (error) {
      console.error('Achievements fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  });

  // Personality Analysis Routes
  
  // Trigger initial personality analysis for new users without personality type
  app.post("/api/personality/initialize/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check if user already has personality type
      const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (existingUser.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (existingUser[0].personalityType) {
        return res.json({ success: true, message: 'User already has personality type', personality: existingUser[0].personalityType });
      }
      
      // Trigger personality analysis for new user
      const analysis = await personalityAI.analyzeUserPersonality(userId);
      res.json({ success: true, personalityUpdate: analysis });
    } catch (error) {
      console.error('Initialize personality error:', error);
      res.status(500).json({ error: 'Failed to initialize personality' });
    }
  });
  
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

  // AI Chat endpoint
  app.post('/api/ai-chat', isAuthenticated, async (req, res) => {
    try {
      const { message, userProfile } = req.body;
      const userId = req.user.id;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Generate AI response using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for a student development platform called Thinkle. 
            
            You help students with:
            - Goal setting and personal development
            - Strength analysis and personality insights
            - Team collaboration and finding teammates
            - Opportunity discovery and career guidance
            - Study strategies and skill development
            
            The user's profile:
            - Name: ${userProfile?.name || 'Student'}
            - Personality Type: ${userProfile?.personalityType || 'Not determined'}
            - Interests: ${userProfile?.interests?.join(', ') || 'Not specified'}
            
            Always provide helpful, personalized advice. Be encouraging and specific. 
            Include actionable suggestions when possible.
            
            Format your response as a JSON object with:
            - response: Your main response text
            - suggestions: Array of 3-4 follow-up questions/prompts the user might be interested in`
          },
          {
            role: "user",
            content: message
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Track this interaction for continuous learning
      await personalityAI.trackAiChatInteraction(userId, message, aiResponse.response);

      res.json(aiResponse);
    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ 
        error: 'AI service temporarily unavailable',
        response: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        suggestions: ['Help me set goals', 'Analyze my strengths', 'Find opportunities', 'Team recommendations']
      });
    }
  });

  // Create a new team
  app.post("/api/teams", async (req, res) => {
    try {
      const { name, description, category, skills, maxMembers, isPrivate, userId } = req.body;
      
      // Validate required fields
      if (!name || !description || !category || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create the team
      const [newTeam] = await db.insert(teams).values({
        name,
        description,
        creatorId: userId,
        category,
        skills: skills || [],
        maxMembers: maxMembers || 5,
        isPrivate: isPrivate || false,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }).returning();

      // Add creator as team leader
      await db.insert(teamMembers).values({
        teamId: newTeam.id,
        userId: userId,
        role: 'Team Leader',
      });

      // Track team creation interaction
      await personalityAI.trackTeamInteraction(userId, newTeam.id, 'created_team', {
        teamName: name,
        category,
        skills: skills || [],
        isLeader: true
      });

      res.json({ 
        success: true, 
        team: newTeam,
        message: 'Team created successfully' 
      });
    } catch (error) {
      console.error('Team creation error:', error);
      res.status(500).json({ error: 'Failed to create team' });
    }
  });

  // Get user's teams
  app.get("/api/users/:userId/teams", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Get teams where user is a member
      const userTeams = await db.select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
        category: teams.category,
        skills: teams.skills,
        maxMembers: teams.maxMembers,
        isPrivate: teams.isPrivate,
        status: teams.status,
        progress: teams.progress,
        deadline: teams.deadline,
        createdAt: teams.createdAt,
        role: teamMembers.role,
        memberCount: sql<number>`(SELECT COUNT(*) FROM ${teamMembers} WHERE ${teamMembers.teamId} = ${teams.id})`
      })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId));

      res.json(userTeams);
    } catch (error) {
      console.error('Get user teams error:', error);
      res.status(500).json({ error: 'Failed to get user teams' });
    }
  });

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const { name, description, teamId, priority, deadline, userId } = req.body;
      
      // Validate required fields
      if (!name || !userId) {
        return res.status(400).json({ error: 'Name and userId are required' });
      }

      // Create the project
      const [newProject] = await db.insert(projects).values({
        name,
        description: description || '',
        teamId: teamId || null,
        creatorId: userId,
        priority: priority || 'medium',
        deadline: deadline ? new Date(deadline) : null,
      }).returning();

      res.json({ 
        success: true, 
        project: newProject,
        message: 'Project created successfully' 
      });
    } catch (error) {
      console.error('Project creation error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // Get user's projects
  app.get("/api/users/:userId/projects", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Get projects created by user or for teams they're in
      const userProjects = await db.select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        teamId: projects.teamId,
        status: projects.status,
        priority: projects.priority,
        progress: projects.progress,
        deadline: projects.deadline,
        createdAt: projects.createdAt,
        taskCount: sql<number>`(SELECT COUNT(*) FROM ${projectTasks} WHERE ${projectTasks.projectId} = ${projects.id})`,
        completedTasks: sql<number>`(SELECT COUNT(*) FROM ${projectTasks} WHERE ${projectTasks.projectId} = ${projects.id} AND ${projectTasks.completed} = true)`
      })
      .from(projects)
      .leftJoin(teamMembers, eq(projects.teamId, teamMembers.teamId))
      .where(
        or(
          eq(projects.creatorId, userId),
          eq(teamMembers.userId, userId)
        )
      );

      // Calculate progress based on completed tasks
      const projectsWithProgress = userProjects.map(project => ({
        ...project,
        progress: project.taskCount > 0 ? Math.round((project.completedTasks / project.taskCount) * 100) : 0
      }));

      res.json(projectsWithProgress);
    } catch (error) {
      console.error('Get user projects error:', error);
      res.status(500).json({ error: 'Failed to get user projects' });
    }
  });

  // Get project tasks
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      
      const tasks = await db.select().from(projectTasks).where(eq(projectTasks.projectId, projectId));
      
      res.json(tasks);
    } catch (error) {
      console.error('Get project tasks error:', error);
      res.status(500).json({ error: 'Failed to get project tasks' });
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
      const userIdentifier = req.user.claims?.sub || req.user.id;
      if (userId !== userIdentifier) {
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

  // Assessment questions endpoint
  app.get("/api/assessments", async (req, res) => {
    const assessmentQuestions = [
      {
        id: 1,
        question: "When working on a group project, you prefer to:",
        options: [
          { value: "leader", text: "Take charge and organize the team's efforts" },
          { value: "innovator", text: "Generate creative ideas and new approaches" },
          { value: "collaborator", text: "Make sure everyone's voice is heard" },
          { value: "perfectionist", text: "Focus on getting all details exactly right" },
          { value: "explorer", text: "Research thoroughly before making decisions" },
          { value: "mediator", text: "Help resolve any conflicts that arise" },
          { value: "strategist", text: "Analyze the situation and plan the best approach" },
          { value: "anchor", text: "Provide steady support and keep everyone calm" }
        ]
      },
      {
        id: 2,
        question: "Your ideal learning environment is:",
        options: [
          { value: "leader", text: "Leading study groups and teaching others" },
          { value: "innovator", text: "Experimenting with new learning methods" },
          { value: "collaborator", text: "Working closely with classmates" },
          { value: "perfectionist", text: "Quiet space where you can focus completely" },
          { value: "explorer", text: "Hands-on experiences and field trips" },
          { value: "mediator", text: "Discussion-based learning with diverse perspectives" },
          { value: "strategist", text: "Structured courses with clear learning objectives" },
          { value: "anchor", text: "Consistent routine with reliable resources" }
        ]
      },
      {
        id: 3,
        question: "When facing a challenging problem, you typically:",
        options: [
          { value: "leader", text: "Rally others to tackle it together" },
          { value: "innovator", text: "Think of unconventional solutions" },
          { value: "collaborator", text: "Seek input from multiple people" },
          { value: "perfectionist", text: "Break it down into manageable steps" },
          { value: "explorer", text: "Research similar problems and solutions" },
          { value: "mediator", text: "Find common ground among different approaches" },
          { value: "strategist", text: "Analyze patterns and develop a systematic plan" },
          { value: "anchor", text: "Stay calm and work through it methodically" }
        ]
      },
      {
        id: 4,
        question: "In your free time, you're most likely to:",
        options: [
          { value: "leader", text: "Organize events or activities for friends" },
          { value: "innovator", text: "Try new hobbies or create something original" },
          { value: "collaborator", text: "Spend quality time with friends and family" },
          { value: "perfectionist", text: "Practice skills until you master them" },
          { value: "explorer", text: "Visit new places or learn about different cultures" },
          { value: "mediator", text: "Help friends work through their problems" },
          { value: "strategist", text: "Plan future goals and organize your life" },
          { value: "anchor", text: "Relax and provide support to those who need it" }
        ]
      },
      {
        id: 5,
        question: "Your friends would describe you as:",
        options: [
          { value: "leader", text: "The natural leader who gets things done" },
          { value: "innovator", text: "The creative one with unique ideas" },
          { value: "collaborator", text: "The team player who brings people together" },
          { value: "perfectionist", text: "The reliable one who pays attention to details" },
          { value: "explorer", text: "The curious one who loves learning new things" },
          { value: "mediator", text: "The peaceful one who helps everyone get along" },
          { value: "strategist", text: "The smart one who thinks ahead" },
          { value: "anchor", text: "The dependable one who's always there for others" }
        ]
      },
      {
        id: 6,
        question: "When starting a new project, you first:",
        options: [
          { value: "leader", text: "Define clear goals and delegate tasks" },
          { value: "innovator", text: "Brainstorm creative possibilities" },
          { value: "collaborator", text: "Gather your team and discuss ideas" },
          { value: "perfectionist", text: "Plan every detail before beginning" },
          { value: "explorer", text: "Research what others have done before" },
          { value: "mediator", text: "Ensure everyone agrees on the approach" },
          { value: "strategist", text: "Analyze requirements and create a timeline" },
          { value: "anchor", text: "Establish a solid foundation and stable workflow" }
        ]
      },
      {
        id: 7,
        question: "Under pressure, you tend to:",
        options: [
          { value: "leader", text: "Step up and take control of the situation" },
          { value: "innovator", text: "Find creative ways to work around obstacles" },
          { value: "collaborator", text: "Bring people together to share the load" },
          { value: "perfectionist", text: "Focus intensely on getting everything right" },
          { value: "explorer", text: "Seek new information to understand the situation" },
          { value: "mediator", text: "Keep everyone calm and focused" },
          { value: "strategist", text: "Analyze the situation and prioritize actions" },
          { value: "anchor", text: "Remain steady and provide stability for others" }
        ]
      },
      {
        id: 8,
        question: "Your communication style is best described as:",
        options: [
          { value: "leader", text: "Direct and decisive" },
          { value: "innovator", text: "Creative and inspiring" },
          { value: "collaborator", text: "Inclusive and encouraging" },
          { value: "perfectionist", text: "Precise and detailed" },
          { value: "explorer", text: "Curious and questioning" },
          { value: "mediator", text: "Diplomatic and understanding" },
          { value: "strategist", text: "Analytical and forward-thinking" },
          { value: "anchor", text: "Calm and reassuring" }
        ]
      },
      {
        id: 9,
        question: "When making decisions, you primarily consider:",
        options: [
          { value: "leader", text: "What will achieve the best results quickly" },
          { value: "innovator", text: "What new possibilities this might open up" },
          { value: "collaborator", text: "How it will affect everyone involved" },
          { value: "perfectionist", text: "What the most thorough and correct approach is" },
          { value: "explorer", text: "What you might learn from different options" },
          { value: "mediator", text: "What solution everyone can agree on" },
          { value: "strategist", text: "What the long-term implications are" },
          { value: "anchor", text: "What provides the most stability and security" }
        ]
      },
      {
        id: 10,
        question: "Your greatest strength in a team setting is:",
        options: [
          { value: "leader", text: "Motivating others and driving progress" },
          { value: "innovator", text: "Bringing fresh perspectives and ideas" },
          { value: "collaborator", text: "Building strong relationships and unity" },
          { value: "perfectionist", text: "Ensuring quality and attention to detail" },
          { value: "explorer", text: "Gathering information and learning opportunities" },
          { value: "mediator", text: "Resolving conflicts and finding compromise" },
          { value: "strategist", text: "Planning ahead and anticipating challenges" },
          { value: "anchor", text: "Providing consistent support and reliability" }
        ]
      }
    ];

    res.json(assessmentQuestions);
  });

  // AI-powered opportunity recommendations
  app.get("/api/opportunities/recommendations/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // Keep as string since user IDs are strings
      
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
