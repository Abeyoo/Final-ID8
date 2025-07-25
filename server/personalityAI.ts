import OpenAI from "openai";
import { db } from "./db";
import { 
  users, 
  assessmentResponses, 
  goals, 
  achievements, 
  teamInteractions, 
  personalityAnalysis,
  opportunities,
  personalityPercentiles,
  aiChatInteractions,
  interestEvolution
} from "@shared/schema";
import { eq, and, desc, gte } from "drizzle-orm";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface PersonalityScores {
  Leader: number;
  Innovator: number;
  Collaborator: number;
  Perfectionist: number;
  Explorer: number;
  Mediator: number;
  Strategist: number;
  Anchor: number;
}

interface BehaviorData {
  assessmentResponses: any[];
  goals: any[];
  achievements: any[];
  teamInteractions: any[];
  opportunities: any[];
  aiChatInteractions: any[];
  currentPersonality: string | null;
  currentInterests: string[];
}

export class PersonalityAnalysisService {
  
  async analyzeUserPersonality(userId: string): Promise<{
    updatedPersonality: string;
    personalityScores: PersonalityScores;
    confidence: number;
    reasoning: string;
  }> {
    // Gather comprehensive behavioral data
    const behaviorData = await this.gatherBehaviorData(userId);
    
    // Use AI to analyze patterns and update personality
    const analysis = await this.performAIAnalysis(behaviorData);
    
    // Store the analysis results
    await this.storeAnalysisResults(userId, analysis, behaviorData.currentPersonality);
    
    return analysis;
  }

  private async gatherBehaviorData(userId: string): Promise<BehaviorData> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get current user data
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    // Get recent assessment responses
    const assessmentData = await db
      .select()
      .from(assessmentResponses)
      .where(and(
        eq(assessmentResponses.userId, userId),
        gte(assessmentResponses.timestamp, thirtyDaysAgo)
      ));

    // Get goals data (created, completed patterns)
    const goalsData = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId));

    // Get achievements
    const achievementsData = await db
      .select()
      .from(achievements)
      .where(and(
        eq(achievements.userId, userId),
        gte(achievements.earnedAt, thirtyDaysAgo)
      ));

    // Get team interactions
    const teamData = await db
      .select()
      .from(teamInteractions)
      .where(and(
        eq(teamInteractions.userId, userId),
        gte(teamInteractions.timestamp, thirtyDaysAgo)
      ));

    // Get opportunity interactions
    const opportunityData = await db
      .select()
      .from(opportunities)
      .where(and(
        eq(opportunities.userId, userId),
        gte(opportunities.timestamp, thirtyDaysAgo)
      ));

    // Get AI chat interactions
    const aiChatData = await db
      .select()
      .from(aiChatInteractions)
      .where(and(
        eq(aiChatInteractions.userId, userId),
        gte(aiChatInteractions.timestamp, thirtyDaysAgo)
      ));

    return {
      assessmentResponses: assessmentData,
      goals: goalsData,
      achievements: achievementsData,
      teamInteractions: teamData,
      opportunities: opportunityData,
      aiChatInteractions: aiChatData,
      currentPersonality: user?.personalityType || null,
      currentInterests: user?.initialInterests || []
    };
  }

  // New method: Track AI chat interaction and extract insights
  async trackAiChatInteraction(userId: string, message: string, response: string): Promise<void> {
    // Use AI to extract interests and personality indicators from the conversation
    const insights = await this.extractChatInsights(message, response);
    
    // Store the interaction with insights
    await db.insert(aiChatInteractions).values({
      userId,
      message,
      response,
      extractedInterests: insights.interests,
      personalityIndicators: insights.personalityIndicators
    });

    // Check if we should update user's interests based on this interaction
    if (insights.interests.length > 0) {
      await this.updateUserInterests(userId, insights.interests, 'ai_chat');
    }

    // Trigger personality analysis if significant personality indicators detected
    if (insights.personalityIndicators && Object.keys(insights.personalityIndicators).length > 0) {
      await this.analyzeUserPersonality(userId);
    }
  }

  // Extract interests and personality indicators from chat conversation
  private async extractChatInsights(message: string, response: string): Promise<{
    interests: string[];
    personalityIndicators: Record<string, number>;
  }> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI that analyzes conversations to extract interests and personality indicators. 
            
            Interest categories: Science, Technology, Arts, Leadership, Sports, Community, Business, Environment, Social Sciences
            
            Personality types: Leader, Innovator, Collaborator, Perfectionist, Explorer, Mediator, Strategist, Anchor
            
            Analyze the conversation and return a JSON object with:
            - interests: array of interest categories mentioned or implied
            - personalityIndicators: object with personality types as keys and confidence scores (0-1) as values
            
            Only include interests and personality indicators that are clearly evident from the conversation.`
          },
          {
            role: "user",
            content: `Student message: "${message}"\nAI response: "${response}"`
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        interests: result.interests || [],
        personalityIndicators: result.personalityIndicators || {}
      };
    } catch (error) {
      console.error('Error extracting chat insights:', error);
      return { interests: [], personalityIndicators: {} };
    }
  }

  // Update user interests based on new evidence
  private async updateUserInterests(userId: string, newInterests: string[], reason: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return;

    const currentInterests = user.initialInterests || [];
    
    // Add new interests that aren't already present
    const updatedInterests = [...new Set([...currentInterests, ...newInterests])];
    
    // Only update if there are actual changes
    if (updatedInterests.length > currentInterests.length) {
      // Record the interest evolution
      await db.insert(interestEvolution).values({
        userId,
        previousInterests: currentInterests,
        updatedInterests,
        changeReason: reason,
        confidence: 0.7 // Moderate confidence for AI-detected interests
      });

      // Update user's interests
      await db.update(users)
        .set({ initialInterests: updatedInterests })
        .where(eq(users.id, userId));
    }
  }

  // Enhanced goal tracking with interest detection
  async trackGoalCreation(userId: string, goalData: any): Promise<void> {
    // Extract interests from goal category and description
    const goalInterests = this.extractInterestsFromGoal(goalData);
    
    if (goalInterests.length > 0) {
      await this.updateUserInterests(userId, goalInterests, 'goal_creation');
    }

    // Trigger personality analysis as goals reflect personality
    await this.analyzeUserPersonality(userId);
  }

  // Extract interests from goal data
  private extractInterestsFromGoal(goalData: any): string[] {
    const interests: string[] = [];
    const categoryMapping: Record<string, string> = {
      'academic': 'Science',
      'technology': 'Technology',
      'creative': 'Arts',
      'leadership': 'Leadership',
      'fitness': 'Sports',
      'community': 'Community',
      'business': 'Business',
      'environmental': 'Environment',
      'social': 'Social Sciences'
    };

    // Map goal category to interest
    if (goalData.category && categoryMapping[goalData.category.toLowerCase()]) {
      interests.push(categoryMapping[goalData.category.toLowerCase()]);
    }

    // Analyze goal description for additional interests
    const description = (goalData.description || '').toLowerCase();
    if (description.includes('science') || description.includes('research')) interests.push('Science');
    if (description.includes('technology') || description.includes('coding')) interests.push('Technology');
    if (description.includes('art') || description.includes('creative')) interests.push('Arts');
    if (description.includes('lead') || description.includes('organize')) interests.push('Leadership');
    if (description.includes('sport') || description.includes('fitness')) interests.push('Sports');
    if (description.includes('volunteer') || description.includes('community')) interests.push('Community');
    if (description.includes('business') || description.includes('entrepreneur')) interests.push('Business');
    if (description.includes('environment') || description.includes('climate')) interests.push('Environment');
    if (description.includes('psychology') || description.includes('social')) interests.push('Social Sciences');

    return [...new Set(interests)];
  }

  // Enhanced opportunity tracking with interest learning
  async trackOpportunityInteraction(
    userId: string,
    opportunityData: any,
    actionType: string
  ): Promise<void> {
    // Store the interaction
    await db.insert(opportunities).values({
      userId,
      opportunityType: opportunityData.type,
      category: opportunityData.category,
      title: opportunityData.title,
      description: opportunityData.description,
      actionType,
      interactionData: { ...opportunityData, actionType }
    });

    // If user applied to opportunity, strongly indicate interest in that category
    if (actionType === 'applied') {
      await this.updateUserInterests(userId, [opportunityData.category], 'opportunity_application');
      
      // Trigger personality analysis for applications (shows commitment and interests)
      await this.analyzeUserPersonality(userId);
    }
  }

  // Enhanced assessment tracking
  async trackAssessmentResponse(userId: string, assessmentType: string, questionId: string, response: string): Promise<void> {
    // Store the assessment response
    await db.insert(assessmentResponses).values({
      userId,
      assessmentType,
      questionId,
      response
    });

    // Extract interests from assessment responses
    const interests = this.extractInterestsFromAssessment(assessmentType, questionId, response);
    if (interests.length > 0) {
      await this.updateUserInterests(userId, interests, 'assessment');
    }

    // Trigger personality analysis after assessment completion
    await this.analyzeUserPersonality(userId);
  }

  // Extract interests from assessment responses
  private extractInterestsFromAssessment(assessmentType: string, questionId: string, response: string): string[] {
    const interests: string[] = [];
    const responseLower = response.toLowerCase();

    // Map common assessment responses to interests
    const interestKeywords = {
      'Science': ['science', 'research', 'experiment', 'lab', 'biology', 'chemistry', 'physics'],
      'Technology': ['technology', 'coding', 'programming', 'computer', 'software', 'engineering'],
      'Arts': ['art', 'creative', 'design', 'music', 'writing', 'drawing', 'painting'],
      'Leadership': ['lead', 'organize', 'manage', 'coordinate', 'direct', 'influence'],
      'Sports': ['sport', 'athletic', 'fitness', 'exercise', 'team', 'competition'],
      'Community': ['volunteer', 'help', 'community', 'service', 'social impact', 'charity'],
      'Business': ['business', 'entrepreneur', 'finance', 'marketing', 'sales', 'startup'],
      'Environment': ['environment', 'nature', 'climate', 'sustainability', 'conservation'],
      'Social Sciences': ['psychology', 'sociology', 'history', 'politics', 'culture', 'society']
    };

    // Check for keyword matches
    Object.entries(interestKeywords).forEach(([interest, keywords]) => {
      if (keywords.some(keyword => responseLower.includes(keyword))) {
        interests.push(interest);
      }
    });

    return interests;
  }

  // Get updated behavior data that includes AI chat interactions
  private async gatherBehaviorData(userId: string): Promise<BehaviorData> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get current user data
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    // Get recent assessment responses
    const assessmentData = await db
      .select()
      .from(assessmentResponses)
      .where(and(
        eq(assessmentResponses.userId, userId),
        gte(assessmentResponses.timestamp, thirtyDaysAgo)
      ));

    // Get goals data (created, completed patterns)
    const goalsData = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId));

    // Get achievements
    const achievementsData = await db
      .select()
      .from(achievements)
      .where(and(
        eq(achievements.userId, userId),
        gte(achievements.earnedAt, thirtyDaysAgo)
      ));

    // Get team interactions
    const teamData = await db
      .select()
      .from(teamInteractions)
      .where(and(
        eq(teamInteractions.userId, userId),
        gte(teamInteractions.timestamp, thirtyDaysAgo)
      ));

    // Get opportunity interactions
    const opportunityData = await db
      .select()
      .from(opportunities)
      .where(and(
        eq(opportunities.userId, userId),
        gte(opportunities.timestamp, thirtyDaysAgo)
      ));

    return {
      assessmentResponses: assessmentData,
      goals: goalsData,
      achievements: achievementsData,
      teamInteractions: teamData,
      opportunities: opportunityData,
      currentPersonality: user?.personalityType || null
    };
  }

  private async performAIAnalysis(behaviorData: BehaviorData): Promise<{
    updatedPersonality: string;
    personalityScores: PersonalityScores;
    confidence: number;
    reasoning: string;
  }> {
    const prompt = this.createAnalysisPrompt(behaviorData);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert personality psychologist analyzing student behavior patterns. 
            Based on comprehensive behavioral data, provide personality insights using these 8 categories:
            - Leader: Takes initiative, organizes teams, achieves ambitious goals
            - Innovator: Creative solutions, generates original ideas, adaptable
            - Collaborator: Team-oriented, builds relationships, seeks harmony
            - Perfectionist: Detail-oriented, high standards, quality-focused
            - Explorer: Curious learner, seeks new experiences, research-oriented
            - Mediator: Diplomatic peacemaker, resolves conflicts, finds common ground
            - Strategist: Long-term planning, analytical thinking, systematic approach
            - Anchor: Stable foundation, reliable support, consistent performance
            
            Respond with JSON in this exact format:
            {
              "personalityScores": {
                "Leader": 0.15,
                "Innovator": 0.25,
                "Collaborator": 0.10,
                "Perfectionist": 0.20,
                "Explorer": 0.30,
                "Mediator": 0.00,
                "Strategist": 0.00,
                "Anchor": 0.00
              },
              "primaryPersonality": "Explorer",
              "confidence": 0.85,
              "reasoning": "Detailed explanation of analysis based on behavioral patterns..."
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const analysisResult = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        updatedPersonality: analysisResult.primaryPersonality,
        personalityScores: analysisResult.personalityScores,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(behaviorData);
    }
  }

  private createAnalysisPrompt(behaviorData: BehaviorData): string {
    let prompt = `Analyze this student's personality based on their behavioral patterns:\n\n`;
    
    prompt += `Current Personality: ${behaviorData.currentPersonality || 'Not set'}\n\n`;

    // Assessment responses analysis
    if (behaviorData.assessmentResponses.length > 0) {
      prompt += `Assessment Responses (${behaviorData.assessmentResponses.length} responses):\n`;
      behaviorData.assessmentResponses.forEach(response => {
        prompt += `- ${response.assessmentType}: ${response.questionId} → ${response.response}\n`;
      });
      prompt += '\n';
    }

    // Goals analysis
    if (behaviorData.goals.length > 0) {
      const completedGoals = behaviorData.goals.filter(g => g.completed);
      const goalCategories = behaviorData.goals.reduce((acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      prompt += `Goals Patterns:\n`;
      prompt += `- Total goals: ${behaviorData.goals.length}\n`;
      prompt += `- Completed: ${completedGoals.length}\n`;
      prompt += `- Categories: ${Object.entries(goalCategories).map(([cat, count]) => `${cat}(${count})`).join(', ')}\n`;
      prompt += `- Completion rate: ${Math.round((completedGoals.length / behaviorData.goals.length) * 100)}%\n\n`;
    }

    // Achievements analysis
    if (behaviorData.achievements.length > 0) {
      const achievementTypes = behaviorData.achievements.reduce((acc, achievement) => {
        acc[achievement.achievementType] = (acc[achievement.achievementType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      prompt += `Recent Achievements:\n`;
      prompt += `- Total: ${behaviorData.achievements.length}\n`;
      prompt += `- Types: ${Object.entries(achievementTypes).map(([type, count]) => `${type}(${count})`).join(', ')}\n\n`;
    }

    // Team interactions analysis
    if (behaviorData.teamInteractions.length > 0) {
      const actionTypes = behaviorData.teamInteractions.reduce((acc, interaction) => {
        acc[interaction.actionType] = (acc[interaction.actionType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      prompt += `Team Collaboration Patterns:\n`;
      prompt += `- Total interactions: ${behaviorData.teamInteractions.length}\n`;
      prompt += `- Action types: ${Object.entries(actionTypes).map(([action, count]) => `${action}(${count})`).join(', ')}\n\n`;
    }

    // Opportunity preferences analysis
    if (behaviorData.opportunities.length > 0) {
      const opportunityCategories = behaviorData.opportunities.reduce((acc, opp) => {
        acc[opp.category] = (acc[opp.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const opportunityTypes = behaviorData.opportunities.reduce((acc, opp) => {
        acc[opp.opportunityType] = (acc[opp.opportunityType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const actionTypes = behaviorData.opportunities.reduce((acc, opp) => {
        acc[opp.actionType] = (acc[opp.actionType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      prompt += `Opportunity Preferences:\n`;
      prompt += `- Total interactions: ${behaviorData.opportunities.length}\n`;
      prompt += `- Categories: ${Object.entries(opportunityCategories).map(([cat, count]) => `${cat}(${count})`).join(', ')}\n`;
      prompt += `- Types: ${Object.entries(opportunityTypes).map(([type, count]) => `${type}(${count})`).join(', ')}\n`;
      prompt += `- Actions: ${Object.entries(actionTypes).map(([action, count]) => `${action}(${count})`).join(', ')}\n\n`;
    }

    prompt += `Based on this data, determine:
1. The most fitting personality type from the 8 categories: Leader, Innovator, Collaborator, Perfectionist, Explorer, Mediator, Strategist, Anchor
2. Confidence scores for each personality type (must sum to 1.0)
3. Overall confidence in the analysis (0-1)
4. Detailed reasoning explaining the personality assessment

Personality Type Definitions:
- Leader: Guides others and drives decisions
- Innovator: Generates original ideas and disrupts the norm
- Collaborator: Builds relationships and unites teams
- Perfectionist: Strives for excellence and precision
- Explorer: Craves new experiences and growth
- Mediator: Resolves tensions and promotes understanding
- Strategist: Analyzes patterns and plans with foresight
- Anchor: Offers reliability, support, and calm under pressure`;

    return prompt;
  }

  private fallbackAnalysis(behaviorData: BehaviorData): {
    updatedPersonality: string;
    personalityScores: PersonalityScores;
    confidence: number;
    reasoning: string;
  } {
    // Enhanced behavioral pattern analysis with randomized starting points to avoid Leader bias
    const baseScores = [0.115, 0.12, 0.125, 0.13, 0.135];
    const shuffledScores = [...baseScores.sort(() => Math.random() - 0.5), 0.125, 0.125, 0.125];
    
    const scores: PersonalityScores = {
      Leader: shuffledScores[0],
      Innovator: shuffledScores[1], 
      Collaborator: shuffledScores[2],
      Perfectionist: shuffledScores[3],
      Explorer: shuffledScores[4],
      Mediator: shuffledScores[5],
      Strategist: shuffledScores[6],
      Anchor: shuffledScores[7]
    };

    // Analyze assessment responses with balanced personality indicators
    behaviorData.assessmentResponses.forEach(response => {
      const responseText = response.response.toLowerCase();
      
      // Leader indicators (reduced bias)
      if (responseText.includes('take_charge') || responseText.includes('lead') || responseText.includes('organize')) {
        scores.Leader += 0.06;
      }
      
      // Innovator indicators (expanded)
      if (responseText.includes('creative') || responseText.includes('innovative') || 
          responseText.includes('original') || responseText.includes('brainstorm') ||
          responseText.includes('think_outside') || responseText.includes('experiment')) {
        scores.Innovator += 0.08;
      }
      
      // Collaborator indicators (expanded)
      if (responseText.includes('team') || responseText.includes('collaborate') || 
          responseText.includes('together') || responseText.includes('consensus') ||
          responseText.includes('include_everyone') || responseText.includes('group')) {
        scores.Collaborator += 0.08;
      }
      
      // Perfectionist indicators (expanded)
      if (responseText.includes('detail') || responseText.includes('quality') || 
          responseText.includes('thorough') || responseText.includes('precise') ||
          responseText.includes('excellence') || responseText.includes('accurate')) {
        scores.Perfectionist += 0.08;
      }
      
      // Explorer indicators (expanded)
      if (responseText.includes('explore') || responseText.includes('research') || 
          responseText.includes('learn') || responseText.includes('discover') ||
          responseText.includes('investigate') || responseText.includes('curious')) {
        scores.Explorer += 0.08;
      }
      
      // Mediator indicators (expanded)
      if (responseText.includes('mediate') || responseText.includes('resolve') || 
          responseText.includes('peaceful') || responseText.includes('diplomatic') ||
          responseText.includes('understand') || responseText.includes('harmony')) {
        scores.Mediator += 0.08;
      }
      
      // Strategist indicators (expanded)
      if (responseText.includes('plan') || responseText.includes('strategy') || 
          responseText.includes('analyze') || responseText.includes('systematic') ||
          responseText.includes('logical') || responseText.includes('future')) {
        scores.Strategist += 0.08;
      }
      
      // Anchor indicators (expanded)
      if (responseText.includes('support') || responseText.includes('stable') || 
          responseText.includes('reliable') || responseText.includes('consistent') ||
          responseText.includes('foundation') || responseText.includes('steady')) {
        scores.Anchor += 0.08;
      }
    });

    // Adjust based on goal completion rate and patterns (balanced approach)
    const completedGoals = behaviorData.goals.filter(g => g.completed).length;
    const totalGoals = behaviorData.goals.length;
    
    if (totalGoals > 0) {
      const completionRate = completedGoals / totalGoals;
      
      // High completion rate indicates different personalities, not just leadership
      if (completionRate > 0.8) {
        scores.Perfectionist += 0.15;  // Reduced Leader bias
        scores.Anchor += 0.12;
        scores.Strategist += 0.08;
        scores.Leader += 0.08;  // Much reduced
      } else if (completionRate > 0.6) {
        scores.Strategist += 0.12;
        scores.Perfectionist += 0.08;
        scores.Anchor += 0.06;
      } else if (completionRate > 0.3) {
        scores.Collaborator += 0.1;
        scores.Mediator += 0.08;
      } else {
        scores.Explorer += 0.15;
        scores.Innovator += 0.12;
      }
      
      // Analyze goal diversity for personality insights
      const goalCategories = behaviorData.goals.reduce((acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const categoryCount = Object.keys(goalCategories).length;
      if (categoryCount > 3) {
        scores.Explorer += 0.1;  // Diverse interests
        scores.Innovator += 0.08;
      } else if (categoryCount === 1) {
        scores.Perfectionist += 0.1;  // Focused approach
        scores.Anchor += 0.08;
      }
    }

    // Adjust based on team interactions
    if (behaviorData.teamInteractions.length > 5) {
      scores.Collaborator += 0.15;
      scores.Mediator += 0.1;
    }

    // Normalize scores
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    Object.keys(scores).forEach(key => {
      scores[key as keyof PersonalityScores] = scores[key as keyof PersonalityScores] / total;
    });

    const primaryPersonality = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof PersonalityScores] > scores[b[0] as keyof PersonalityScores] ? a : b
    )[0];

    return {
      updatedPersonality: primaryPersonality,
      personalityScores: scores,
      confidence: 0.6,
      reasoning: "Fallback analysis based on behavioral patterns and activity levels."
    };
  }

  private async storeAnalysisResults(
    userId: string, 
    analysis: any, 
    previousPersonality: string | null
  ): Promise<void> {
    // Calculate percentiles for this user
    const percentiles = await this.calculatePersonalityPercentiles(userId, analysis.personalityScores);
    
    await db.insert(personalityAnalysis).values({
      userId,
      analysisData: {
        personalityScores: analysis.personalityScores,
        behaviorMetrics: {
          analysisDate: new Date().toISOString(),
          dataPoints: 'comprehensive'
        }
      },
      confidence: analysis.confidence,
      previousPersonality,
      updatedPersonality: analysis.updatedPersonality,
      reasoning: analysis.reasoning,
      percentileChanges: percentiles
    });

    // Update user's personality
    await db.update(users)
      .set({
        personalityType: analysis.updatedPersonality,
        personalityScores: analysis.personalityScores,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Store/update percentiles
    await this.updatePersonalityPercentiles(userId, analysis.personalityScores, percentiles);
  }

  private async calculatePersonalityPercentiles(userId: string, userScores: PersonalityScores): Promise<Record<string, number>> {
    const percentiles: Record<string, number> = {};
    
    // Get all users' personality scores for comparison
    const allUsers = await db.select({
      personalityScores: users.personalityScores
    }).from(users).where(eq(users.personalityScores, null));

    const allScores: Record<string, number[]> = {
      Leader: [],
      Innovator: [],
      Collaborator: [],
      Perfectionist: [],
      Explorer: [],
      Mediator: [],
      Strategist: [],
      Anchor: []
    };

    // Collect all scores for each personality type
    allUsers.forEach(user => {
      if (user.personalityScores) {
        const scores = user.personalityScores as PersonalityScores;
        Object.keys(allScores).forEach(type => {
          if (scores[type as keyof PersonalityScores] !== undefined) {
            allScores[type].push(scores[type as keyof PersonalityScores]);
          }
        });
      }
    });

    // Calculate percentile for each personality type
    Object.keys(userScores).forEach(type => {
      const userScore = userScores[type as keyof PersonalityScores];
      const allTypeScores = allScores[type];
      
      if (allTypeScores.length > 0) {
        const sortedScores = allTypeScores.sort((a, b) => a - b);
        const rank = sortedScores.filter(score => score < userScore).length;
        percentiles[type] = Math.round((rank / sortedScores.length) * 100);
      } else {
        percentiles[type] = 50; // Default to 50th percentile if no data
      }
    });

    return percentiles;
  }

  private async updatePersonalityPercentiles(userId: string, scores: PersonalityScores, percentiles: Record<string, number>): Promise<void> {
    for (const [personalityType, score] of Object.entries(scores)) {
      // Get existing percentile record
      const [existing] = await db
        .select()
        .from(personalityPercentiles)
        .where(and(
          eq(personalityPercentiles.userId, userId),
          eq(personalityPercentiles.personalityType, personalityType)
        ));

      const currentPercentile = percentiles[personalityType] || 50;
      
      if (existing) {
        // Update existing record with new percentile and score history
        const scoreHistory = existing.scoreHistory as any[] || [];
        scoreHistory.push({
          score,
          percentile: currentPercentile,
          timestamp: new Date().toISOString()
        });

        // Keep only last 30 entries
        if (scoreHistory.length > 30) {
          scoreHistory.splice(0, scoreHistory.length - 30);
        }

        await db.update(personalityPercentiles)
          .set({
            percentile: currentPercentile,
            scoreHistory,
            lastCalculated: new Date()
          })
          .where(eq(personalityPercentiles.id, existing.id));
      } else {
        // Create new percentile record
        await db.insert(personalityPercentiles).values({
          userId,
          personalityType,
          percentile: currentPercentile,
          scoreHistory: [{
            score,
            percentile: currentPercentile,
            timestamp: new Date().toISOString()
          }]
        });
      }
    }
  }

  // Method to track behavioral data
  async trackAssessmentResponse(userId: string, assessmentType: string, questionId: string, response: string): Promise<void> {
    await db.insert(assessmentResponses).values({
      userId,
      assessmentType,
      questionId,
      response
    });
  }

  async trackGoalCreation(userId: string, goalData: any): Promise<void> {
    await db.insert(goals).values({
      userId,
      title: goalData.title,
      description: goalData.description,
      category: goalData.category
    });
  }

  async trackGoalCompletion(userId: string, goalId: number): Promise<void> {
    await db.update(goals)
      .set({ 
        completed: true, 
        completedAt: new Date(),
        progress: 100 
      })
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
  }

  async trackAchievement(userId: string, achievementType: string, title: string, description: string): Promise<void> {
    await db.insert(achievements).values({
      userId,
      achievementType,
      title,
      description
    });
  }

  async trackTeamInteraction(userId: string, teamId: number, actionType: string, actionData: any): Promise<void> {
    await db.insert(teamInteractions).values({
      userId,
      teamId,
      actionType,
      actionData
    });
  }

  async trackOpportunityInteraction(
    userId: string, 
    opportunityType: string, 
    category: string, 
    title: string, 
    actionType: string,
    interactionData?: any
  ): Promise<void> {
    await db.insert(opportunities).values({
      userId,
      opportunityType,
      category,
      title,
      description: interactionData?.description || '',
      actionType,
      interactionData
    });
  }

  // Get user's percentile rankings
  async getUserPercentiles(userId: string): Promise<Record<string, any>> {
    const percentiles = await db
      .select()
      .from(personalityPercentiles)
      .where(eq(personalityPercentiles.userId, userId));

    const result: Record<string, any> = {};
    percentiles.forEach(p => {
      result[p.personalityType] = {
        percentile: p.percentile,
        scoreHistory: p.scoreHistory,
        lastCalculated: p.lastCalculated
      };
    });

    return result;
  }

  // Batch update percentiles for all users when new data is available
  async recalculateAllPercentiles(): Promise<void> {
    const allUsers = await db.select({
      id: users.id,
      personalityScores: users.personalityScores
    }).from(users);

    for (const user of allUsers) {
      if (user.personalityScores) {
        const percentiles = await this.calculatePersonalityPercentiles(user.id, user.personalityScores as PersonalityScores);
        await this.updatePersonalityPercentiles(user.id, user.personalityScores as PersonalityScores, percentiles);
      }
    }
  }
}

export const personalityAI = new PersonalityAnalysisService();