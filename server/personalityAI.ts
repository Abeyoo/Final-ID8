import OpenAI from "openai";
import { db } from "./db";
import { 
  users, 
  assessmentResponses, 
  goals, 
  achievements, 
  teamInteractions, 
  personalityAnalysis 
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
}

interface BehaviorData {
  assessmentResponses: any[];
  goals: any[];
  achievements: any[];
  teamInteractions: any[];
  currentPersonality: string | null;
}

export class PersonalityAnalysisService {
  
  async analyzeUserPersonality(userId: number): Promise<{
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

  private async gatherBehaviorData(userId: number): Promise<BehaviorData> {
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

    return {
      assessmentResponses: assessmentData,
      goals: goalsData,
      achievements: achievementsData,
      teamInteractions: teamData,
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
            Based on comprehensive behavioral data, provide personality insights using these 6 categories:
            - Leader: Takes initiative, organizes teams, achieves ambitious goals
            - Innovator: Creative solutions, generates original ideas, adaptable
            - Collaborator: Team-oriented, builds relationships, seeks harmony
            - Perfectionist: Detail-oriented, high standards, quality-focused
            - Explorer: Curious learner, seeks new experiences, research-oriented
            - Mediator: Diplomatic peacemaker, resolves conflicts, finds common ground
            
            Respond with JSON in this exact format:
            {
              "personalityScores": {
                "Leader": 0.15,
                "Innovator": 0.25,
                "Collaborator": 0.10,
                "Perfectionist": 0.20,
                "Explorer": 0.30,
                "Mediator": 0.00
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

    prompt += `Based on this data, determine:
1. The most fitting personality type from the 6 categories
2. Confidence scores for each personality type (must sum to 1.0)
3. Overall confidence in the analysis (0-1)
4. Detailed reasoning explaining the personality assessment`;

    return prompt;
  }

  private fallbackAnalysis(behaviorData: BehaviorData): {
    updatedPersonality: string;
    personalityScores: PersonalityScores;
    confidence: number;
    reasoning: string;
  } {
    // Simple rule-based fallback analysis
    const scores: PersonalityScores = {
      Leader: 0.16,
      Innovator: 0.16,
      Collaborator: 0.17,
      Perfectionist: 0.17,
      Explorer: 0.17,
      Mediator: 0.17
    };

    // Adjust based on goal completion rate
    const completedGoals = behaviorData.goals.filter(g => g.completed).length;
    const totalGoals = behaviorData.goals.length;
    
    if (totalGoals > 0) {
      const completionRate = completedGoals / totalGoals;
      if (completionRate > 0.8) {
        scores.Perfectionist += 0.2;
        scores.Leader += 0.1;
      } else if (completionRate < 0.3) {
        scores.Explorer += 0.2;
        scores.Innovator += 0.1;
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
    userId: number, 
    analysis: any, 
    previousPersonality: string | null
  ): Promise<void> {
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
      reasoning: analysis.reasoning
    });

    // Update user's personality
    await db.update(users)
      .set({
        personalityType: analysis.updatedPersonality,
        personalityScores: analysis.personalityScores,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Method to track behavioral data
  async trackAssessmentResponse(userId: number, assessmentType: string, questionId: string, response: string): Promise<void> {
    await db.insert(assessmentResponses).values({
      userId,
      assessmentType,
      questionId,
      response
    });
  }

  async trackGoalCreation(userId: number, goalData: any): Promise<void> {
    await db.insert(goals).values({
      userId,
      title: goalData.title,
      description: goalData.description,
      category: goalData.category
    });
  }

  async trackGoalCompletion(userId: number, goalId: number): Promise<void> {
    await db.update(goals)
      .set({ 
        completed: true, 
        completedAt: new Date(),
        progress: 100 
      })
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
  }

  async trackAchievement(userId: number, achievementType: string, title: string, description: string): Promise<void> {
    await db.insert(achievements).values({
      userId,
      achievementType,
      title,
      description
    });
  }

  async trackTeamInteraction(userId: number, teamId: number, actionType: string, actionData: any): Promise<void> {
    await db.insert(teamInteractions).values({
      userId,
      teamId,
      actionType,
      actionData
    });
  }
}

export const personalityAI = new PersonalityAnalysisService();