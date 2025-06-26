# ID8 - Student Development Platform

## Overview

ID8 is a comprehensive student development platform designed to help students discover their strengths, set goals, collaborate with peers, and track their personal growth journey. The platform combines self-assessment tools, team collaboration features, AI-powered guidance, and portfolio management to create a holistic development experience for students.

## System Architecture

The application follows a full-stack TypeScript architecture with a clear separation between client and server:

- **Frontend**: React + TypeScript with Vite for fast development and modern tooling
- **Backend**: Express.js server with TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: React state with TanStack Query for server state management
- **Development Environment**: Replit with Node.js 20 and PostgreSQL 16

## Key Components

### Frontend Architecture
- **Component-based React structure** with TypeScript for type safety
- **shadcn/ui component library** providing accessible, customizable UI components
- **Tailwind CSS** for utility-first styling with a custom design system
- **Responsive design** supporting mobile, tablet, and desktop viewports
- **Single Page Application (SPA)** with client-side routing via component switching

### Backend Architecture
- **Express.js server** with TypeScript for API endpoints
- **Modular route structure** with dedicated route handlers
- **Storage abstraction layer** supporting both in-memory and database implementations
- **Development middleware** for request logging and error handling
- **Vite integration** for seamless development experience

### Database Design
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations and migrations
- **Schema-first approach** with shared TypeScript types
- **Zod validation** for runtime type checking and form validation

### Authentication System
- **Session-based authentication** using connect-pg-simple for PostgreSQL session storage
- **Mock authentication** in development with predefined user profiles
- **Role-based access** supporting student and mentor roles
- **Email validation** with student domain verification

## Data Flow

1. **User Authentication**: Users sign in or complete onboarding process
2. **Profile Management**: User data stored in PostgreSQL with session management
3. **Assessment Engine**: Students complete various assessments (strengths, personality, interests)
4. **Goal Setting**: AI-assisted goal creation with milestone tracking
5. **Team Matching**: Algorithm-based team formation using compatibility scoring
6. **Progress Tracking**: Real-time updates on goals, projects, and achievements
7. **Community Features**: Social interaction with posts, mentoring, and discussions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity optimized for serverless
- **drizzle-orm**: Type-safe ORM with automatic TypeScript type generation
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Accessible, unstyled UI primitives
- **class-variance-authority**: Type-safe CSS class composition
- **zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast build tool with HMR for development
- **TypeScript**: Static type checking across the entire stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast bundling for production server code

## Deployment Strategy

### Development Environment
- **Replit hosting** with automatic deployments
- **PostgreSQL 16** database provisioning
- **Environment variables** for database connection and configuration
- **Hot module replacement** for rapid development iteration

### Production Build
- **Vite build** for optimized client bundle
- **ESBuild** for server-side code bundling
- **Static asset serving** via Express.js
- **Autoscale deployment** target for production scaling

### Database Management
- **Drizzle migrations** for schema version control
- **Push-based deployment** for development environments
- **Environment-specific configurations** via DATABASE_URL

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

- The application uses a monorepo structure with shared TypeScript types between client and server
- Database schema is defined in a shared location (`shared/schema.ts`) for type consistency
- The storage layer provides abstraction allowing for easy switching between in-memory and database implementations
- Component architecture follows React best practices with hooks for state management
- The platform is designed to be extensible with modular components and clear separation of concerns
- AI chat functionality is implemented client-side with mock responses, ready for integration with external AI services
- Assessment engine supports multiple assessment types with extensible question formats
- Team matching algorithm uses compatibility scoring based on strengths, interests, and project preferences