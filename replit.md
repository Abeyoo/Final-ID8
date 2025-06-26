# ID8 Student Development Platform

## Overview
A comprehensive student development platform that helps students with career assessment, skill development, team collaboration, and opportunities discovery. The platform features a modern React frontend with Express backend, designed for high school students to explore their potential and connect with peers.

## Project Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Express.js with in-memory storage (MemStorage)
- **Database Schema**: Drizzle ORM with PostgreSQL table definitions
- **Authentication**: Client-side mock authentication with localStorage persistence
- **Development**: Vite for frontend bundling, full-stack setup on port 5000

## Key Features
- Sign-in/Authentication system (now landing page)
- Student onboarding flow
- Skills assessment and development planning
- Team collaboration tools
- Project board and team finder
- AI chat assistant
- Portfolio management
- Achievement tracking
- Schedule management
- Community features

## Recent Changes
- **2025-01-26**: Migrated from Bolt to Replit environment
  - Configured proper client/server separation
  - Updated authentication flow to show sign-in as landing page
  - Verified all dependencies and workflows are functioning
  - Project successfully running on Replit with proper security practices

## User Preferences
- Prefers sign-in page as the landing experience instead of onboarding
- Values clear, professional communication
- Focuses on student-centered design and functionality

## Development Notes
- Uses mock authentication with predefined user accounts for testing
- Storage interface is abstracted for easy database integration later
- Component structure follows modern React patterns with proper TypeScript typing
- All major sections accessible through navigation after authentication